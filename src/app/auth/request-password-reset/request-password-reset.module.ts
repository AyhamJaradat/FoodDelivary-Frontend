import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestPasswordResetPageRoutingModule } from './request-password-reset-routing.module';

import { RequestPasswordResetPage } from './request-password-reset.page';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RequestPasswordResetPageRoutingModule,
    TranslateModule,
    FontAwesomeModule
  ],
  declarations: [RequestPasswordResetPage]
})
export class RequestPasswordResetPageModule {}
