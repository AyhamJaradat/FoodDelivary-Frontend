import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModalController, MenuController } from '@ionic/angular';
import { OrderService } from '../../services/order.service';
import { APP_CONSTANTS } from '../../interfaces/constants';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.page.html',
  styleUrls: ['./orders-list.page.scss'],
})
export class OrdersListPage implements OnInit {


    // Whether current User is Owner or regular user
    public amIOwner: boolean = true;
    public currentUser;

    public pageTitle: string = "Orders List";
    public emptyMessage1: string;
    public emptyMessage2: string;
    public emptyMessage3: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService,
    private modalController: ModalController,
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if(this.currentUser != null){
        if(this.currentUser.userRole == APP_CONSTANTS.REGULAR_USER_ROLE ){
          this.amIOwner = false;
        }else{
          //APP_CONSTANTS.OWNER_USER_ROLE
          this.amIOwner = true;
        }
        this.doInitialization();
      }
    });
  }
  public doInitialization(){

    if(this.amIOwner){
      // I am Owner
      this.pageTitle = "Orders Of Restaurants";
    }else{
      // I am regualar user 
      this.pageTitle = "Orders List";
    }
    this.orderService.clearCachedData();
    this.orderService.onRequestData(null,null);
    this.initilizeEmptyMessageTest();
  }

  public initilizeEmptyMessageTest() {
    if (this.amIOwner) {
      this.emptyMessage1 = "";
      this.emptyMessage2 = "No Orders Yet";
      this.emptyMessage3 = "";
    } else {
      this.emptyMessage1 = "You have No Orders";
      this.emptyMessage2 = "";
      this.emptyMessage3 = "Start or Complete your first Order";
    }
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true);
  }
  ionViewWillEnter() {
  }

  public openInitialOrderPage(){
    this.router.navigate(['order-details']);
  }

  public openRestaurantsPage(){
    this.router.navigate(['restaurant']);
  }

  public doRefresh(event) {
    // clear data
    this.orderService.clearCachedData();
    this.orderService.onRequestData(null,event);

  }

   // to be called from a card after doing edit with many effects
   public refreshData(event) {
    // clear data
    this.orderService.clearCachedData();
    this.orderService.onRequestData(null,null);
  }

  public loadInfiniteData(event){
    this.orderService.onRequestData(event,null);
  }


  public openOrderDetailsPage(order){
    let navigationExtras: NavigationExtras = {
      state: {
        order: order
      }
    };
    this.router.navigate(['order-details',order.id], navigationExtras);
  }

}
