import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { iAutopart } from '../interfaces/i-autopart';
import { iAutopartResponse } from '../interfaces/i-autopart-response';
import { IPage } from '../interfaces/i-page';

@Injectable({
  providedIn: 'root',
})
export class AutopartsService {
  autopartsUrl = environment.autopartsUrl;

  constructor(private http: HttpClient) {}

  getAllAutoparts(
    page: number = 0,
    size: number = 10
  ): Observable<IPage<iAutopartResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<IPage<iAutopartResponse>>(this.autopartsUrl, {
      params,
    });
  }

  createAutopart(autopart: iAutopart): Observable<iAutopart> {
    // Verifica che l'array veicoliIds sia presente
    if (!autopart.veicoliIds || autopart.veicoliIds.length === 0) {
      throw new Error('Seleziona almeno un veicolo compatibile');
    }
    return this.http.post<iAutopart>(this.autopartsUrl, autopart);
  }

  getByReseller(
    resellerId: number,
    page: number = 0,
    size: number = 10
  ): Observable<IPage<iAutopartResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<IPage<iAutopartResponse>>(
      `${this.autopartsUrl}/reseller/${resellerId}`,
      { params }
    );
  }

  searchAutoparts(
    filters: any,
    page: number = 0,
    size: number = 10
  ): Observable<IPage<iAutopartResponse>> {
    const params = new HttpParams({ fromObject: { ...filters, page, size } });
    return this.http.get<IPage<iAutopartResponse>>(
      `${this.autopartsUrl}/search`,
      { params }
    );
  }
}
