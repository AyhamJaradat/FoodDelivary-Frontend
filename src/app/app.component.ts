import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LanguageService } from './services/language.service';
import { AuthService } from './services/auth.service';
import { Router,ActivatedRoute, UrlSegment } from '@angular/router';
import { OrderService } from './services/order.service';
import { MealService } from './services/meal.service';
import { RestaurantService } from './services/restaurant.service';
import { PeopleService } from './services/people.service';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  // test pushing to development
  public appPages = [
    { title: "Home", url: "/home", icon: "home" },
    { title: "Restaurants", url: "/restaurant", icon: "business" },
    { title: "Orders", url: "/orders-list", icon: "cart" },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private language: LanguageService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService:OrderService,
    private mealService:MealService,
    private restaurantService:RestaurantService,
    private peopleService:PeopleService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.language.setDefault("en");
      // this.authService.authSubject$.subscribe(state => {
      //   // when state is null, we did not check the storage yet.
      //   // if(state == null ) return;
      //   // if(state == false) this.router.navigate(['login']);
      //   // if (state) {
      //   //   this.router.navigate(['home']);
      //   // } else {
      //   //   this.router.navigate(['login']);
      //   // }
      // });
    });
  }

  public onLogOut() {
    // clear Data
    this.orderService.clearCachedData();
    this.orderService.clearInitOrder();

    this.peopleService.clearCachedData();
    this.restaurantService.clearCachedData();
    this.mealService.clearCachedData();

    this.authService.logout();
  }
}
