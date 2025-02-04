import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { IFavourite } from '../interfaces/i-favourite';

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  favouriteUrl = environment.favouriteUrl;

  constructor(private http: HttpClient) {}

  addFavourite(autopartId: number): Observable<IFavourite> {
    return this.http.post<IFavourite>( //passiamo null come secondo parametro perchè il backend utilizza il path variable e l'utente viene ottenuto automaticamente
      `${this.favouriteUrl}/${autopartId}`,
      null
    );
  }

  removeFavourite(autopartId: number): Observable<void> {
    return this.http.delete<void>(`${this.favouriteUrl}/${autopartId}`);
  }

  getFavouriteByUser(): Observable<IFavourite[]> {
    return this.http.get<IFavourite[]>(this.favouriteUrl);
  }
}
