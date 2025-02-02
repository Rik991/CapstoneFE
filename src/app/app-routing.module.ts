import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './main-components/landing-page/landing-page.component';

import { EditAutopartComponent } from './shared/autopart/edit-autopart/edit-autopart.component';
import { NewAutopartComponent } from './shared/autopart/new-autopart/new-autopart.component';
import { GuestGuard } from './auth/guards/guest.guard';
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [GuestGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'reseller',
    loadChildren: () =>
      import('./reseller/reseller.module').then((m) => m.ResellerModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'new-autopart',
    component: NewAutopartComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-autopart',
    component: EditAutopartComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
