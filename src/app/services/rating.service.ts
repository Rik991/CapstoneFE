import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { iRating } from '../interfaces/i-rating';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  private ratingUrl = environment.ratingUrl;

  constructor(private http: HttpClient) {}

  submitRating(rating: iRating): Observable<iRating> {
    return this.http.post<iRating>(this.ratingUrl, rating);
  }

  getAverageRating(resellerId: number): Observable<number> {
    return this.http.get<number>(
      `${this.ratingUrl}/reseller/${resellerId}/average`
    );
  }
}
