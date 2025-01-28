import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';
import { LandingPagwComponent } from './pages/landing-pagw/landing-pagw.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AppComponent, LandingPagwComponent, LandingPageComponent],
  imports: [BrowserModule, AppRoutingModule, NgbModule],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
