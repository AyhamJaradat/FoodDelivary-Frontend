import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MealsListPage } from './meals-list.page';

const routes: Routes = [
  {
    path: '',
    component: MealsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MealsListPageRoutingModule {}
