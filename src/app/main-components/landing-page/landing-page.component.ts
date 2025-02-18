import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  isLoggedIn: boolean = false;
  currentForm: 'login' | 'register' | null = null;
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

  showForm(form: 'login' | 'register'): void {
    this.currentForm = form;
  }

  hideForm(): void {
    this.currentForm = null;
  }
  onRegistrationComplete(): void {
    // Nascondiamo il form di registrazione e mostriamo quello di login
    setTimeout(() => {
      this.showForm('login');
    }, 500); // Piccolo delay per permettere all'alert di essere visualizzato
  }
}
