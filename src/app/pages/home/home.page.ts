import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { APP_CONSTANTS } from '../../interfaces/constants';
import { RestaurantService } from '../../services/restaurant.service';
import { OrderService } from '../../services/order.service';
import { PeopleService } from '../../services/people.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {


  public userDetails;
  public amIOwner: boolean = false;

  // Resaurants Data
  public totalRestaurants: number = 0;
  public isRestaurantsLoading: boolean = true;

  // Orders Data
  public totalOrders: number = 0;
  public pendindActionOrders: number = 0;
  public isOrdersLoading: boolean = true;


  // Customers Data
  public totalCustomers: number = 0;
  public blockedCustomers: number = 0;
  public isCustomersLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private menuCtrl: MenuController,
    public router: Router,
    private restaurantService: RestaurantService,
    private orderService: OrderService,
    private peopleService:PeopleService
  ) { }

  ngOnInit() {

    this.authService.user$.subscribe(user => {
      this.userDetails = user;
      this.amIOwner = this.userDetails.userRole == APP_CONSTANTS.OWNER_USER_ROLE;

    });
  }
  ionViewDidEnter() {
    this.menuCtrl.enable(true);
  }
  ionViewWillEnter() {

    this.getRestaurantData();
    this.getOrdersData();
    if(this.amIOwner){
      this.getCustomersData();
    }

  }

    /**
* get Customers count
*/
public getCustomersData() {

  this.isCustomersLoading = true;
  // get the data
  const totalPromise = new Promise(resolve => {
    this.peopleService.getCustomersList(5).subscribe(
      (response: any) => {
        this.totalCustomers = response.headers.get("X-Pagination-Total-Count");
        resolve(this.totalCustomers);
      }, error => {
        this.totalCustomers = 0;
        resolve(this.totalCustomers);
      }
    );
  });
  const pendingPromise = new Promise(resolve => {
    this.peopleService.getBlockedCustomers(5).subscribe(
      (response: any) => {
        this.blockedCustomers = response.headers.get("X-Pagination-Total-Count");
        resolve(this.blockedCustomers);
      }, error => {
        this.blockedCustomers = 0;
        resolve(this.blockedCustomers);
      }
    );
  });



  Promise.all([totalPromise, pendingPromise]).then((values: any) => {
    // values is array [totalOrders, pendindActionOrders]
    this.isCustomersLoading = false;
  });

}


  /**
* get orders count
*/
  public getOrdersData() {

    this.isRestaurantsLoading = true;
    // get the data
    const totalPromise = new Promise(resolve => {
      this.orderService.getOrdersList(5).subscribe(
        (response: any) => {
          this.totalOrders = response.headers.get("X-Pagination-Total-Count");
          resolve(this.totalOrders);
        }, error => {
          this.totalOrders = 0;
          resolve(this.totalOrders);
        }
      );
    });
    const pendingPromise = new Promise(resolve => {
      this.orderService.getPendingActionOrders(5).subscribe(
        (response: any) => {
          this.pendindActionOrders = response.headers.get("X-Pagination-Total-Count");
          resolve(this.pendindActionOrders);
        }, error => {
          this.pendindActionOrders = 0;
          resolve(this.pendindActionOrders);
        }
      );
    });



    Promise.all([totalPromise, pendingPromise]).then((values: any) => {
      // values is array [totalOrders, pendindActionOrders]
      this.isOrdersLoading = false;
    });

  }

  /**
* get Restaurants count
*/
  public getRestaurantData() {

    this.isRestaurantsLoading = true;
    // get the data
    this.restaurantService.getRestaurantsList(5).subscribe(
      (response: any) => {

        this.totalRestaurants = response.headers.get("X-Pagination-Total-Count");
        this.isRestaurantsLoading = false;
      }, error => {
        this.totalRestaurants = 0;
        this.isRestaurantsLoading = false;
      }
    );
  }




  public goToRestaurantsPage() {
    this.router.navigate(['restaurant']);
  }
  public goToOrdersPage() {
    this.router.navigate(['orders-list']);
  }

  public goToCustomersPage(){
    this.router.navigate(['people']);
  }




}
