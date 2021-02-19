import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTimeAgoPipe } from './pipes/custom-time-ago.pipe';



@NgModule({
  declarations: [CustomTimeAgoPipe],
  imports: [
    CommonModule
  ],
  exports: [CustomTimeAgoPipe]
})
export class SharedModule { }
