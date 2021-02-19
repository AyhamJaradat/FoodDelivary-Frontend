import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule, HttpClient ,HTTP_INTERCEPTORS} from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FontAwesomeModule,FaIconLibrary  } from '@fortawesome/angular-fontawesome';
// import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { LanguageService } from './services/language.service';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicSelectableModule } from 'ionic-selectable';

/* -------------------------------- SERVICES -------------------------------- */
import { ModalsModule } from './modals';
import { CreateRestaurantModalPageModule } from './modals/create-restaurant-modal/create-restaurant-modal.module';
import { CreateMealModalPageModule } from './modals/create-meal-modal/create-meal-modal.module';





export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
// add the fontAwsome library
// library.add(fas,far);


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AuthModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (LanguageLoader),
        deps: [HttpClient]
      }
    }),
    FontAwesomeModule, 
    CreateRestaurantModalPageModule,
    CreateMealModalPageModule,
    BrowserAnimationsModule,
    IonicSelectableModule,
    ModalsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LanguageService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

 constructor(library: FaIconLibrary) {
    //  library.add(fas, faCoffee);
       library.addIconPacks(fas);
       library.addIconPacks(far);
    //  library.addIcons(faCoffee);
      }
}
