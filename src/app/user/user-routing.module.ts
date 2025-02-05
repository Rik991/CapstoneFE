import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserPageComponent } from './user-page/user-page.component';

const routes: Routes = [
  { path: '', component: UserComponent, canActivate: [AuthGuard] },
  {
    path: 'user-page',
    component: UserPageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
