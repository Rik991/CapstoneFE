import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs/internal/Observable';
import { iReseller } from '../interfaces/i-reseller';
import { iResellerInfo } from '../interfaces/i-reseller-info';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResellerService {
  resellerUrl = environment.resellerUrl;
  updateResellerUrl = environment.resellerUpdateUrl;

  constructor(private http: HttpClient) {}

  getResellerById(id: number): Observable<iReseller> {
    return this.http.get<iReseller>(`${this.resellerUrl}/by-user/${id}`);
  }

  getResellerInfoById(id: number): Observable<iResellerInfo> {
    return this.http.get<iReseller>(`${this.resellerUrl}/by-user/${id}`).pipe(
      map((reseller: iReseller) => {
        if (reseller.id === undefined) {
          throw new Error('Reseller ID is undefined');
        }
        return {
          id: reseller.id,
          ragioneSociale: reseller.ragioneSociale,
          sitoWeb: reseller.sitoWeb,
          ratingMedio: reseller.ratingMedio,
        } as iResellerInfo;
      })
    );
  }

  // Metodo per aggiornare il reseller
  updateReseller(
    id: number,
    resellerData: iReseller,
    avatar?: File
  ): Observable<iReseller> {
    const formData = new FormData();
    // Serializziamo l'oggetto reseller e lo aggiungiamo con il nome 'appUser'
    formData.append('appUser', JSON.stringify(resellerData));
    // Se è presente un file avatar, lo aggiungiamo
    if (avatar) {
      formData.append('avatar', avatar);
    }
    return this.http.put<iReseller>(
      `${this.updateResellerUrl}/${id}`,
      formData
    );
  }
}
