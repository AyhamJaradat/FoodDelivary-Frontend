import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantPageRoutingModule } from './restaurant-routing.module';

import { RestaurantPage } from './restaurant.page';
import { SpinnerComponentModule } from '../../components/spinner/spinner.component.module';
import { RestaurantCardComponentModule } from '../../components/restaurant-card/restaurant-card.component.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestaurantPageRoutingModule,
    SpinnerComponentModule,
    RestaurantCardComponentModule
  ],
  declarations: [RestaurantPage]
})
export class RestaurantPageModule {}
