import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NewAutopartComponent } from './new-autopart/new-autopart.component';
import { AutopartSearchComponent } from './components/autopart-search/autopart-search.component';

@NgModule({
  declarations: [NewAutopartComponent, AutopartSearchComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [NewAutopartComponent, AutopartSearchComponent],
})
export class SharedModule {}
