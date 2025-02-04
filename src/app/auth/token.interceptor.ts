import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authSvc: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authSvc.authSubject$.pipe(
      take(1), // prende solo il valore corrente e poi completa l'Observable
      switchMap((accessData) => {
        if (!accessData) {
          return next.handle(request);
        }

        const newRequest = request.clone({
          headers: request.headers.append(
            'Authorization',
            `Bearer ${accessData.accessToken}`
          ),
        });
        return next.handle(newRequest);
      })
    );
  }
}
