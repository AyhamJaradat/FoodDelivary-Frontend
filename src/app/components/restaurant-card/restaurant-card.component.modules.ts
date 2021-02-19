import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RestaurantCardComponent } from './restaurant-card.component';


@NgModule({
  declarations: [RestaurantCardComponent],
  imports: [
    IonicModule,
    CommonModule,
    FontAwesomeModule
  ],
  exports: [RestaurantCardComponent],
})
export class RestaurantCardComponentModule { }