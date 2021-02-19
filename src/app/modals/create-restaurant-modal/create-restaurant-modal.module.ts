import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateRestaurantModalPageRoutingModule } from './create-restaurant-modal-routing.module';

import { CreateRestaurantModalPage } from './create-restaurant-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateRestaurantModalPageRoutingModule
  ],
  declarations: [CreateRestaurantModalPage]
})
export class CreateRestaurantModalPageModule {}
