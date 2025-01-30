import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResellerRoutingModule } from './reseller-routing.module';
import { ResellerComponent } from './reseller.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ResellerComponent],
  imports: [CommonModule, ResellerRoutingModule, SharedModule],
})
export class ResellerModule {}
