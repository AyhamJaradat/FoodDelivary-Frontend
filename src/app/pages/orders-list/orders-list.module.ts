import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersListPageRoutingModule } from './orders-list-routing.module';

import { OrdersListPage } from './orders-list.page';
import { SpinnerComponentModule } from '../../components/spinner/spinner.component.module';
import { OrderCardComponentModule } from '../../components/order-card/order-card.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersListPageRoutingModule,
    SpinnerComponentModule,
    OrderCardComponentModule
  ],
  declarations: [OrdersListPage]
})
export class OrdersListPageModule {}
