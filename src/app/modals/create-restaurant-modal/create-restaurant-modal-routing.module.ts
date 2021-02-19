import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateRestaurantModalPage } from './create-restaurant-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CreateRestaurantModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateRestaurantModalPageRoutingModule {}
