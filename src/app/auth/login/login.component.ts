import { Component } from '@angular/core';
import { iLoginRequest } from '../../interfaces/i-login-request';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  formData: iLoginRequest = {
    username: '',
    password: '',
  };

  constructor(private authSvc: AuthService, private router: Router) {}

  login() {
    this.authSvc
      .login(this.formData)
      .pipe(take(1))
      .subscribe({
        next: () => {
          const role = this.authSvc.getUserRole();
          switch (role) {
            case 'ROLE_ADMIN':
              this.router.navigate(['/admin']);
              break;
            case 'ROLE_USER':
              this.router.navigate(['/user']);
              break;
            case 'ROLE_RESELLER':
              this.router.navigate(['/reseller']);
              break;
            default:
              this.router.navigate(['/auth/login']);
          }
          alert('Login effettuato correttamente');
        },
        error: (err) => {
          alert('Errore durante il login');
        },
      });
  }
}
