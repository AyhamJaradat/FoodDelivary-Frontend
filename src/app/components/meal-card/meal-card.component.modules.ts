import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MealCardComponent } from './meal-card.component';



@NgModule({
  declarations: [MealCardComponent],
  imports: [
    IonicModule,
    CommonModule,
    FontAwesomeModule
  ],
  exports: [MealCardComponent],
})
export class MealCardComponentModule { }