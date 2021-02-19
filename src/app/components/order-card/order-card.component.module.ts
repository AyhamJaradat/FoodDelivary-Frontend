import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrderCardComponent } from './order-card.component';



@NgModule({
  declarations: [OrderCardComponent],
  imports: [
    IonicModule,
    CommonModule,
    FontAwesomeModule
  ],
  exports: [OrderCardComponent],
})
export class OrderCardComponentModule { }