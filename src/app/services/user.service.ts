import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iUser } from '../interfaces/i-user';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  userUrl: string = environment.userUrl;
  updateUserUrl: string = environment.userUpdateUrl;

  getAllUser(): Observable<iUser[]> {
    return this.http.get<iUser[]>(this.userUrl);
  }

  getUserById(userId: number): Observable<iUser> {
    return this.http.get<iUser>(`${this.userUrl}/${userId}`);
  }

  updateUser(id: number, userData: iUser, avatar?: File): Observable<iUser> {
    // convertiamo il form che ci arriva in JSON
    const formData = new FormData();
    formData.append('appUser', JSON.stringify(userData));
    // controlliamo se c'è l'avatar
    if (avatar) {
      formData.append('avatar', avatar);
    }
    return this.http.put<iUser>(`${this.updateUserUrl}/${id}`, formData);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.userUrl}/${userId}`);
  }
}
