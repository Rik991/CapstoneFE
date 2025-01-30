import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { iAutopart } from '../interfaces/i-autopart';

@Injectable({
  providedIn: 'root',
})
export class AutopartsService {
  autopartsUrl = environment.autopartsUrl;

  constructor(private http: HttpClient) {}

  //getALlAutoparts()
  getAllAutoparts(): Observable<iAutopart[]> {
    return this.http.get<iAutopart[]>(this.autopartsUrl);
  }

  createAutoparts(autopart: iAutopart) {
    this.http.post<iAutopart>(this.autopartsUrl, autopart);
  }
}
