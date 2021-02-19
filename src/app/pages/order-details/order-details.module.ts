import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderDetailsPageRoutingModule } from './order-details-routing.module';

import { OrderDetailsPage } from './order-details.page';
import { ContentLoaderModule } from '@netbasal/ngx-content-loader';
import { MealCardComponentModule } from '../../components/meal-card/meal-card.component.modules';
import { OrderLogCardComponentModule } from '../../components/order-log-card/order-log-card.component.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderDetailsPageRoutingModule,
    ContentLoaderModule,
    MealCardComponentModule,
    OrderLogCardComponentModule
  ],
  declarations: [OrderDetailsPage]
})
export class OrderDetailsPageModule {}
