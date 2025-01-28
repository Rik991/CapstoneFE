import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isLoggedIn: boolean = false;

  constructor(private authSvc: AuthService) {}

  ngOnInit(): void {
    this.authSvc.isLoggedIn$.subscribe(
      (isLogged) => (this.isLoggedIn = isLogged)
    );
  }

  logout(): void {
    this.authSvc.logout();
    alert('logout effettuato correttamente');
  }
}
