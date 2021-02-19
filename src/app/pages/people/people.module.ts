import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PeoplePageRoutingModule } from './people-routing.module';

import { PeoplePage } from './people.page';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerComponentModule } from '../../components/spinner/spinner.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpinnerComponentModule,
    PeoplePageRoutingModule,
    TranslateModule,
  ],
  declarations: [PeoplePage]
})
export class PeoplePageModule {}
