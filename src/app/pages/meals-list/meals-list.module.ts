import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MealsListPageRoutingModule } from './meals-list-routing.module';

import { MealsListPage } from './meals-list.page';
import { SpinnerComponentModule } from '../../components/spinner/spinner.component.module';
import { MealCardComponentModule } from '../../components/meal-card/meal-card.component.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MealsListPageRoutingModule,
    SpinnerComponentModule,
    MealCardComponentModule
  ],
  declarations: [MealsListPage]
})
export class MealsListPageModule {}
