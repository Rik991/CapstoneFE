import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResellerRoutingModule } from './reseller-routing.module';
import { ResellerComponent } from './reseller.component';


@NgModule({
  declarations: [
    ResellerComponent
  ],
  imports: [
    CommonModule,
    ResellerRoutingModule
  ]
})
export class ResellerModule { }
