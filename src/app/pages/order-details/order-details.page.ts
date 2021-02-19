import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RestaurantService } from '../../services/restaurant.service';
import { MealService } from '../../services/meal.service';
import { ModalController, MenuController } from '@ionic/angular';
import { APP_CONSTANTS } from '../../interfaces/constants';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  public pageTitle: string = "Order Details";

  public restaurant = null;
  public restaurantName = null;
  public order = null;

  // Whether this order is created by me as a Regular User
  public isMyOrder: boolean = true;
  public currentUser;

  // order id
  public order_id = null;

  public isInitialOrder: boolean = true;

  public segmentTab: any = "meals";
  public selectedTabIndex: number = 0;

  public isOrderLoading: boolean = true;


  public isShowChangeStatusBtn:boolean=false;
  public changeStatusText:string= "";
  public allowedNextStatusId:number=0;



  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private restaurantService: RestaurantService,
    private mealService: MealService,
    private modalController: ModalController,
    private menuCtrl: MenuController,
    private orderService: OrderService
  ) {

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
       
        this.restaurant = this.router.getCurrentNavigation().extras.state.restaurant;
        if(this.restaurant)
        this.restaurantName = this.restaurant.name;

        // order 
        this.order = this.router.getCurrentNavigation().extras.state.order;

      }
    });
  }

  ngOnInit() {

    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser != null) {
        if (this.currentUser.userRole == APP_CONSTANTS.REGULAR_USER_ROLE) {
          this.isMyOrder = true;
        } else {
          this.isMyOrder = false;
        }

      }
    });

    this.order_id = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.order_id) {
      //Already Placed Order
      this.isInitialOrder = false;
      // Always call get A restaurant API to update the restaurant data
      if (this.order == null) {
        // call api to get the restaurant using the id
        this.orderService.getAnOrder(this.order_id).subscribe(
          (response: any) => {
           
              this.order = response;
              this.restaurantName = this.order.restaurant_name;
              this.checkNextStatus();
              this.isOrderLoading = false;
              
          
          },error=>{
              // check errors
              this.isOrderLoading = false;
              console.log(error);
          });
      } else {
        // this.doInitialization();
        this.restaurantName = this.order.restaurant_name;
        this.checkNextStatus();
        this.isOrderLoading = false;

      }
    } else {
      // initial Order
      this.isInitialOrder = true;
      // Always call get A restaurant API to update the restaurant data
      if (this.restaurant == null && this.isInitialOrder && this.orderService.initOrder.restaurant_id > 0) {
        // call api to get the restaurant using the id
        this.restaurantService.getARestaurant(this.orderService.initOrder.restaurant_id).subscribe(
          (response: any) => {
          
              this.restaurant = response;
              this.restaurantName = this.restaurant.name;
              this.isOrderLoading = false;
          
          },error=>{
            this.isOrderLoading = false;
          });
      } else {
        // could happen when user refresh initial order details page 
        // selected meals will be lost, only display empty order page
        
        this.isOrderLoading = false;
      }
    }

  }

  public checkNextStatus(){

    // public isShowChangeStatusBtn:boolean=false;
    // public changeStatusText:string= "";
    // public allowedNextStatusId:number=0;
    if(this.isInitialOrder) {
      // should not happen
      return;

    }
    if(this.isMyOrder){
      // for Regular User
      if(this.order.status == APP_CONSTANTS.ORDER_STATUS.PLACED){
        this.isShowChangeStatusBtn = true;
        this.changeStatusText = "Cancel Order";
        this.allowedNextStatusId = 2;

      }else if(this.order.status == APP_CONSTANTS.ORDER_STATUS.DELIVERED){
        this.isShowChangeStatusBtn = true;
        this.changeStatusText = "Set As Received";
        this.allowedNextStatusId = 6;
      }else{
        // no status change allowed
        this.isShowChangeStatusBtn = false;
        this.changeStatusText = "";
        this.allowedNextStatusId = 0;
      }
    }else{
      // for Owner
      if(this.order.status == APP_CONSTANTS.ORDER_STATUS.PLACED){
        this.isShowChangeStatusBtn = true;
        this.changeStatusText = "Process Order";
        this.allowedNextStatusId =3;

      }else if(this.order.status == APP_CONSTANTS.ORDER_STATUS.PROCESSING){
        this.isShowChangeStatusBtn = true;
        this.changeStatusText = "Set As In-Route";
        this.allowedNextStatusId = 4;
      }else if(this.order.status == APP_CONSTANTS.ORDER_STATUS.IN_ROUTE){
        this.isShowChangeStatusBtn = true;
        this.changeStatusText = "Set As Delivered";
        this.allowedNextStatusId = 5;
      }else{
        // no status change allowed
        this.isShowChangeStatusBtn = false;
        this.changeStatusText = "";
        this.allowedNextStatusId = 0;
      }
    }

  }

  public changeStatus(){
    if(this.isShowChangeStatusBtn && this.allowedNextStatusId >0 ){

      this.orderService.updateOrderStatus(this.order.id, this.allowedNextStatusId).subscribe(response =>{

        console.log(response);
        this.updatePage(response);
        this.orderService.addOrUpdateOrder(response);
      });

    }
  }

  public updatePage(order) {
    // to refresh the page with given order 
    this.order = order;
    this.order_id = order.id;
    this.isInitialOrder = false;
    // if (this.currentUser.userRole == APP_CONSTANTS.REGULAR_USER_ROLE) {
    if (this.currentUser.id == order.user_id) {
      this.isMyOrder = true;
    } else {
      this.isMyOrder = false;
    }
    this.restaurantName = order.restaurant_name;
    this.checkNextStatus();
    this.isOrderLoading = false;


  }

  public openRestaurantsPage() {
    this.router.navigate(['restaurant']);
  }

  // call API to create the order
  public confirmOrder() {


    let mealIds = this.orderService.initOrder.selected_meals.map(a => a.id);
    let mealCounts = this.orderService.initOrder.selected_meals.map(a => a.count);

    let body = {
      status: APP_CONSTANTS.ORDER_STATUS.PLACED,
      restaurant_id: this.orderService.initOrder.restaurant_id,
      meal_ids: mealIds,
      meal_counts: mealCounts
    };
    this.isOrderLoading = true;
    this.orderService.createOrder(body).subscribe((response) => {

      // order is ready 
      this.updatePage(response);
      this.orderService.clearInitOrder();
      console.log(response);
    })
  }



  /**
   * called on first load of a tab, or on scroll, or on refresh tab
   * @param event 
   */
  public onSegmentChanged(event: any, refresher = null) {

    this.segmentTab = event;
    if (event.detail) {
      this.segmentTab = event.detail.value;
    }
    switch (this.segmentTab) {
      //Meals Case
      case "meals":
        this.selectedTabIndex = 0;
        // if (this.peopleTabsInfo[this.selectedTabIndex].data != null && refresher === null) {
        //   // some data exists previously
        //   this.peopleList = this.peopleTabsInfo[this.selectedTabIndex].data;
        // } else if (this.peopleTabsInfo[this.selectedTabIndex].data === null || this.peopleTabsInfo[this.selectedTabIndex].data.length === 0) {
        //   // first time fetch data
        //   this.peopleList = [];
        // }
        // this.callMyFriendsRequest(refresher);

        break;
      // Order actions case
      case "history":
        this.selectedTabIndex = 1;
        // if (this.peopleTabsInfo[this.selectedTabIndex].data != null && refresher === null) {
        //   // some data exists previously
        //   this.peopleList = this.peopleTabsInfo[this.selectedTabIndex].data;
        // } else if (this.peopleTabsInfo[this.selectedTabIndex].data === null || this.peopleTabsInfo[this.selectedTabIndex].data.length === 0) {
        //   // first time fetch data
        //   this.peopleList = [];
        // }
        // this.callSuggestedRequest(refresher);
        break;

    }


  }

}
