import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateMealModalPage } from './create-meal-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CreateMealModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateMealModalPageRoutingModule {}
