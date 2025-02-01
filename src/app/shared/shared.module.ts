import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AutopartSearchComponent } from './components/autopart-search/autopart-search.component';
import { AutopartComponent } from './autopart/autopart.component';
import { NewAutopartComponent } from './autopart/new-autopart/new-autopart.component';

@NgModule({
  declarations: [
    NewAutopartComponent,
    AutopartSearchComponent,
    AutopartComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [NewAutopartComponent, AutopartSearchComponent],
})
export class SharedModule {}
