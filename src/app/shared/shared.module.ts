import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewAutopartComponent } from './new-autopart/new-autopart.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [NewAutopartComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [NewAutopartComponent],
})
export class SharedModule {}
