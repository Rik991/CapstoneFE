import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResellerRoutingModule } from './reseller-routing.module';
import { ResellerComponent } from './reseller.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ResellerComponent],
  imports: [
    CommonModule,
    ResellerRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class ResellerModule {}
