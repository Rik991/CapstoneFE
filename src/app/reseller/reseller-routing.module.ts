import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResellerComponent } from './reseller.component';

const routes: Routes = [{ path: '', component: ResellerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResellerRoutingModule { }
