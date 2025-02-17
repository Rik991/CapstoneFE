import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { iUser } from '../interfaces/i-user';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  users: iUser[] = [];
  imgUrl: string = environment.imgUrl;
  userRole: string | null = null;

  constructor(private userSvc: UserService, private authSvc: AuthService) {}

  ngOnInit() {
    this.userRole = this.authSvc.getUserRole();
    this.getAllUsers();
  }

  getAllUsers() {
    this.userSvc.getAllUser().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => console.error('Utenti non trovati', err),
    });
  }

  deleteUser(userId: number): void {
    this.userSvc.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== userId);
        alert('Utente cancellato correttamente');
      },
      error: (err) =>
        console.error("Errore nella cancellazione dell'utente", err),
    });
  }
}
