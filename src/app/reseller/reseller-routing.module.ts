import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResellerComponent } from './reseller.component';
import { SharedModule } from '../shared/shared.module';
import { NewAutopartComponent } from '../shared/autopart/new-autopart/new-autopart.component';
import { EditAutopartComponent } from '../shared/autopart/edit-autopart/edit-autopart.component';

const routes: Routes = [
  { path: '', component: ResellerComponent },
  { path: 'new-autopart', component: NewAutopartComponent },
  { path: 'edit-autopart/:id', component: EditAutopartComponent },
  { path: ':id', component: ResellerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class ResellerRoutingModule {}
