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

  createAutopart(formData: FormData): Observable<iAutopartResponse> {
    return this.http.post<iAutopartResponse>(
      `${environment.autopartsUrl}`,
      formData
    );
  }

  getByReseller(resellerId: number): Observable<IPage<iAutopartResponse>> {
    return this.http.get<IPage<iAutopartResponse>>(
      `${environment.autopartsUrl}/reseller`,
      {
        params: { resellerId: resellerId.toString() },
      }
    );
  }

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
