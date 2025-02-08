import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map, Subscription, tap } from 'rxjs';
import { iAccessData } from '../interfaces/i-access-data';
import { Router } from '@angular/router';
import { iUser } from '../interfaces/i-user';
import { iLoginRequest } from '../interfaces/i-login-request';
import { iReseller } from '../interfaces/i-reseller';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtHelper: JwtHelperService = new JwtHelperService();

  //creiamo un behavior subject per conservare le info di autenticazione (token e utende da iAccessData)
  public authSubject$ = new BehaviorSubject<iAccessData | null>(null);

  //creiamo l'observable (o subject) per vedere se l'utente è loggato
  isLoggedIn$ = this.authSubject$.pipe(map((accessData) => !!accessData));
  //e l'observable per ottenere i dati dell'utente loggato
  user$ = this.authSubject$
    .asObservable()
    .pipe(map((accessData) => accessData?.user));

  constructor(private http: HttpClient, private router: Router) {
    this.restoreUser();
  }

  //endpoint per registrare un nuovo utente normale
  registerUser(formData: FormData) {
    return this.http.post<iUser>(environment.registerUserUrl, formData);
  }

  //endpoint per registrare un nuovo rivenditore
  registerReseller(formData: FormData) {
    return this.http.post<iReseller>(environment.registerResellerUrl, formData);
  }

  // il metodo login salva il token e imposta l'autologout in base alla scadenza
  login(authData: iLoginRequest) {
    return this.http.post<iAccessData>(environment.loginUrl, authData).pipe(
      tap((accessData) => {
        this.authSubject$.next(accessData);
        localStorage.setItem('accessData', JSON.stringify(accessData));
        const expDate = this.jwtHelper.getTokenExpirationDate(
          accessData.accessToken
        );
        if (expDate) {
          this.autoLogout(expDate);
        }
      })
    );
  }

  logout() {
    this.authSubject$.next(null);
    localStorage.removeItem('accessData');
    this.router.navigate(['/']);
  }

  // Imposta un timeout per il logout automatico quando il token scade
  autoLogout(expDate: Date) {
    const expMs = expDate.getTime() - new Date().getTime();
    setTimeout(() => {
      this.logout();
    }, expMs);
  }

  // Ripristina i dati di autenticazione (se presenti e non scaduti) dal localStorage
  restoreUser() {
    const userJson = localStorage.getItem('accessData');
    if (!userJson) return;
    const accessData: iAccessData = JSON.parse(userJson);
    if (this.jwtHelper.isTokenExpired(accessData.accessToken)) {
      localStorage.removeItem('accessData');
      return;
    }
    this.authSubject$.next(accessData);
  }

  // Estrae il ruolo (presupponendo che il token contenga un array 'roles')
  getUserRole(): string | null {
    const accessData = this.authSubject$.value;
    if (!accessData) return null;
    const decodedToken = this.jwtHelper.decodeToken(accessData.accessToken);
    return decodedToken?.roles ? decodedToken.roles[0] : null;
  }

  getCurrentUser(): iUser | iReseller | null {
    return this.authSubject$.value?.user || null;
  }
}
