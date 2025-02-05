import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { UserPageComponent } from './user-page/user-page.component';

@NgModule({
  declarations: [UserComponent, UserPageComponent],
  imports: [CommonModule, UserRoutingModule, FormsModule, SharedModule],
})
export class UserModule {}
