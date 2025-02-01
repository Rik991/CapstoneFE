import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { iAutopart } from '../interfaces/i-autopart';
import { iAutopartResponse } from '../interfaces/i-autopart-response';
import { IPage } from '../interfaces/i-page';
import { iSearchFilters } from '../interfaces/i-search-filters';

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

  getByReseller(resellerId: number): Observable<IPage<iAutopartResponse>> {
    return this.http.get<IPage<iAutopartResponse>>(
      `${this.autopartsUrl}/reseller`,
      {
        params: { resellerId: resellerId.toString() },
      }
    );
  }

  createAutopart(formData: FormData): Observable<iAutopartResponse> {
    return this.http.post<iAutopartResponse>(`${this.autopartsUrl}`, formData);
  }

  updateAutopart(
    id: number,
    formData: FormData
  ): Observable<iAutopartResponse> {
    return this.http.put<iAutopartResponse>(
      `${this.autopartsUrl}/${id}`,
      formData
    );
  }

  deleteAutopart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.autopartsUrl}/${id}`);
  }

  // gestione filtri per ricerca autopart
  private removeEmptyParams(params: any): any {
    const newParams: any = {};
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        newParams[key] = value;
      }
    });
    return newParams;
  }

  searchAutoparts(filters: any): Observable<IPage<iAutopartResponse>> {
    const validFilters = this.removeEmptyParams(filters);
    const params = new HttpParams({ fromObject: validFilters });
    return this.http.get<IPage<iAutopartResponse>>(
      `${environment.autopartsUrl}/search`,
      { params }
    );
  }
}
