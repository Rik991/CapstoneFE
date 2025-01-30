import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs/internal/Observable';
import { iReseller } from '../interfaces/i-reseller';

@Injectable({
  providedIn: 'root',
})
export class ResellerService {
  resellerUrl = environment.resellerUrl;

  constructor(private http: HttpClient) {}

  getResellerById(id: number): Observable<iReseller> {
    return this.http.get<iReseller>(`${this.resellerUrl}/${id}`);
  }
}
