import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { OrderLogCardComponent } from './order-log-card.component';



@NgModule({
  declarations: [OrderLogCardComponent],
  imports: [
    IonicModule,
    CommonModule,
    FontAwesomeModule
  ],
  exports: [OrderLogCardComponent],
})
export class OrderLogCardComponentModule { }