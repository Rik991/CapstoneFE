import { Component, EventEmitter, Output } from '@angular/core';
import { iLoginRequest } from '../../interfaces/i-login-request';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formData: iLoginRequest = { username: '', password: '' };
  @Output() close = new EventEmitter<void>();

  constructor(private authSvc: AuthService, private router: Router) {}

  login(): void {
    this.authSvc
      .login(this.formData)
      .pipe(take(1))
      .subscribe({
        next: () => {
          const role = this.authSvc.getUserRole();
          if (role === 'ROLE_ADMIN') {
            this.router.navigate(['/admin']);
          } else if (role === 'ROLE_USER') {
            this.router.navigate(['/user']);
          } else if (role === 'ROLE_RESELLER') {
            this.router.navigate(['/reseller']);
          } else {
            this.router.navigate(['/auth/login']);
          }
          alert('Login successful');
        },
        error: () => alert('Error during login'),
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
