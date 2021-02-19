import { NgModule } from '@angular/core';
import { SpinnerComponent } from './spinner.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [SpinnerComponent],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [SpinnerComponent],
})
export class SpinnerComponentModule { }