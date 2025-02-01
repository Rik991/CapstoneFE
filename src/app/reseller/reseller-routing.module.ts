import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResellerComponent } from './reseller.component';
import { SharedModule } from '../shared/shared.module';
import { NewAutopartComponent } from '../shared/autopart/new-autopart/new-autopart.component';

const routes: Routes = [
  { path: '', component: ResellerComponent },
  { path: 'new-autopart', component: NewAutopartComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class ResellerRoutingModule {}
