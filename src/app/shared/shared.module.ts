import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AutopartSearchComponent } from './components/autopart-search/autopart-search.component';
import { AutopartComponent } from './autopart/autopart.component';
import { NewAutopartComponent } from './autopart/new-autopart/new-autopart.component';
import { EditAutopartComponent } from './autopart/edit-autopart/edit-autopart.component';

@NgModule({
  declarations: [
    NewAutopartComponent,
    AutopartSearchComponent,
    AutopartComponent,
    EditAutopartComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [
    NewAutopartComponent,
    AutopartSearchComponent,
    EditAutopartComponent,
  ],
})
export class SharedModule {}
