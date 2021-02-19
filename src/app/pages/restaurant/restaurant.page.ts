import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModalController, MenuController } from '@ionic/angular';
import { RestaurantService } from '../../services/restaurant.service';
import { CreateRestaurantModalPage } from '../../modals/create-restaurant-modal/create-restaurant-modal.page';
import { APP_CONSTANTS } from '../../interfaces/constants';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
})
export class RestaurantPage implements OnInit {

  // Whether this restaurant is created by me
  public isMyRestaurant: boolean = true;
  public currentUser;

  public pageTitle: string = "My Restaurants";

  public emptyMessage1: string;
  public emptyMessage2: string;
  public emptyMessage3: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private restaurantService: RestaurantService,
    private modalController: ModalController,
    private menuCtrl: MenuController) {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true);
  }
  ionViewWillEnter() {
  }

  ngOnInit() {

    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if(this.currentUser != null){
        if(this.currentUser.userRole == APP_CONSTANTS.REGULAR_USER_ROLE ){
          this.isMyRestaurant = false;
        }else{
          //APP_CONSTANTS.OWNER_USER_ROLE
          this.isMyRestaurant = true;
        }
        this.doInitialization();
      }
    });


  }

  public doInitialization(){

    if(this.isMyRestaurant){
      // I am Owner, Viewing my restaurants
      this.pageTitle = "My Restaurants";
    }else{
      // I am regualar user ,, viewing all restaurants
      this.pageTitle = "Available Restaurants";
    }
    this.restaurantService.clearCachedData();
    this.restaurantService.onRequestData(null,null);
    this.initilizeEmptyMessageTest();
  }

  public initilizeEmptyMessageTest() {
    if (this.isMyRestaurant) {
      this.emptyMessage1 = "Start selling by creating Restaurants and Meals";
      this.emptyMessage2 = "";
      this.emptyMessage3 = "Click on the + button to create your first Restaurant";
    } else {
      this.emptyMessage1 = "Oops, There are no Restaurants Available Now";
      this.emptyMessage2 = "Sorry for that !";
      this.emptyMessage3 = "Try again soon, New Restaurants are comming";
    }
  }

  public addNewRestaurant() {
    if(this.isMyRestaurant){
      this.openCreateRestaurantModal();
    } 
  }

  /**
   * Open create-restaurant modal for current logged in user
   */
  async openCreateRestaurantModal() {
    const modal = await this.modalController.create({
      component: CreateRestaurantModalPage,
      cssClass: 'create-restaurant-modal'
    });
    modal.onDidDismiss().then((response: any) => {
      // console.log(data);
      if (response && response.data) {
        if (response.data.status == "new-created" || response.data.status == "updated") {
          let newRestaurant = response.data.restaurant;
          this.restaurantService.addOrUpdateRestaurant(response.data.restaurant);
          console.log(newRestaurant);
        }
      }
    })
    return await modal.present();
  }




  public doRefresh(event) {
    // clear data
    this.restaurantService.clearCachedData();
    this.restaurantService.onRequestData(null,event);

  }

   // to be called from a card after doing edit with many effects
   public refreshData(event) {
    // clear data
    this.restaurantService.clearCachedData();
    this.restaurantService.onRequestData(null,null);
  }

  public loadInfiniteData(event){
    this.restaurantService.onRequestData(event,null);
  }

 public openRestaurantMealsPage(restaurant){
 
    let navigationExtras: NavigationExtras = {
      state: {
        restaurant: restaurant
      }
    };
    this.router.navigate(['meals-list',restaurant.id], navigationExtras);
    
  }

}
