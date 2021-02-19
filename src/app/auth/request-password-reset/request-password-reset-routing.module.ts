import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestPasswordResetPage } from './request-password-reset.page';

const routes: Routes = [
  {
    path: '',
    component: RequestPasswordResetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestPasswordResetPageRoutingModule {}
