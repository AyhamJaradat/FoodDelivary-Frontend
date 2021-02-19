import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateMealModalPageRoutingModule } from './create-meal-modal-routing.module';

import { CreateMealModalPage } from './create-meal-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateMealModalPageRoutingModule
  ],
  declarations: [CreateMealModalPage]
})
export class CreateMealModalPageModule {}
