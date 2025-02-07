import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private authSvc: AuthService, private router: Router) {}

  ngOnInit(): void {
    // salvo nel contenitore sub (subscription) lo user loggato così da distruggerlo alla fine
    const sub = this.authSvc.isLoggedIn$.subscribe(
      (isLogged) => (this.isLoggedIn = isLogged)
    );
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    // Annulla tutte le subscription al momento della distruzione del componente
    this.subscriptions.unsubscribe();
  }

  logout(): void {
    this.authSvc.logout();
    this.router.navigate(['/']);
    alert('logout effettuato correttamente');
  }
}
