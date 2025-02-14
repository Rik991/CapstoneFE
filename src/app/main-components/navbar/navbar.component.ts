import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  userRole: string | null = null;
  isScrollingDown: boolean = false;
  private lastScrollTop: number = 0;
  private subscriptions: Subscription = new Subscription();

  constructor(private authSvc: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Manteniamo la tua logica originale per l'autenticazione
    const sub = this.authSvc.isLoggedIn$.subscribe((isLogged) => {
      this.isLoggedIn = isLogged;
      this.userRole = this.authSvc.getUserRole();
    });

    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Aggiungiamo la funzionalità di scroll hiding
  @HostListener('window:scroll')
  onWindowScroll(): void {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    // Mostra/nascondi navbar solo dopo 50px di scroll
    if (st > this.lastScrollTop && st > 50) {
      this.isScrollingDown = true;
    } else {
      this.isScrollingDown = false;
    }
    this.lastScrollTop = st <= 0 ? 0 : st;
  }

  // Manteniamo la tua logica per il logout con l'alert
  logout(): void {
    this.authSvc.logout();
    this.router.navigate(['/']);
    alert('logout effettuato correttamente');
  }
}
