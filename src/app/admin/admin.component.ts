import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { iUser } from '../interfaces/i-user';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  users: iUser[] = [];
  imgUrl: string = environment.imgUrl;

  constructor(private userSvc: UserService) {}

  ngOnInit() {
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
