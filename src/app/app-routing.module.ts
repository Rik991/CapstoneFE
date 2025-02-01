import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './main-components/landing-page/landing-page.component';

import { EditAutopartComponent } from './shared/autopart/edit-autopart/edit-autopart.component';
import { NewAutopartComponent } from './shared/autopart/new-autopart/new-autopart.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'reseller',
    loadChildren: () =>
      import('./reseller/reseller.module').then((m) => m.ResellerModule),
  },
  { path: 'new-autopart', component: NewAutopartComponent },
  { path: 'edit-autopart', component: EditAutopartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
