import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { iAutopart } from '../interfaces/i-autoparts';

@Injectable({
  providedIn: 'root',
})
export class AutopartsService {
  getAllAutopartsUrl = environment.getAllAutopartsUrl;

  constructor(private http: HttpClient) {}

  //getALlAutoparts()
  getAllAutoparts(): Observable<iAutopart[]> {
    return this.http.get<iAutopart[]>(this.getAllAutopartsUrl);
  }
}
