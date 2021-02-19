import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RestaurantService } from '../../services/restaurant.service';
import { ModalController, MenuController } from '@ionic/angular';
import { APP_CONSTANTS } from '../../interfaces/constants';
import { MealService } from '../../services/meal.service';
import { CreateMealModalPage } from '../../modals/create-meal-modal/create-meal-modal.page';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-meals-list',
  templateUrl: './meals-list.page.html',
  styleUrls: ['./meals-list.page.scss'],
})
export class MealsListPage implements OnInit {


  public restaurant = null;
  public restaurant_id = null;

  // Whether these meals is created by me , for owner
  public isMyRestaurantMeals: boolean = true;
  public currentUser;

  public pageTitle: string = "My Meals";

  public emptyMessage1: string;
  public emptyMessage2: string;
  public emptyMessage3: string;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private restaurantService: RestaurantService,
    private mealService: MealService,
    private modalController: ModalController,
    private menuCtrl: MenuController,
    private orderService:OrderService) {

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.restaurant = this.router.getCurrentNavigation().extras.state.restaurant;

      }
    });
  }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser != null) {
        if (this.currentUser.userRole == APP_CONSTANTS.REGULAR_USER_ROLE) {
          this.isMyRestaurantMeals = false;
        } else {
          //APP_CONSTANTS.OWNER_USER_ROLE
          this.isMyRestaurantMeals = true;
          // this.doInitialization();
        }

      }
    });

    this.restaurant_id = this.activatedRoute.snapshot.paramMap.get('id');
    // Always call get A restaurant API to update the restaurant data
    if (this.restaurant == null) {
      // call api to get the person using the id
      this.restaurantService.getARestaurant(this.restaurant_id).subscribe(
        (response: any) => {
            this.restaurant = response;
            this.doInitialization();
        });
    } else {
      this.doInitialization();
    }

  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true);
  }
  ionViewWillEnter() {
    // this.menuCtrl.enable(true);
  }

  public doInitialization() {

    if (this.isMyRestaurantMeals) {
      // I am Owner, Viewing my restaurants
      this.pageTitle = "My Meals";
    } else {
      // I am regualar user ,, viewing all restaurants
      this.pageTitle = "Available Meals";
    }
    this.mealService.clearCachedData();
    this.mealService.onRequestData(this.restaurant.id, null, null);
    this.initilizeEmptyMessageTest();
  }

  public initilizeEmptyMessageTest() {
    if (this.isMyRestaurantMeals) {
      this.emptyMessage1 = "Your Restaurant has No Meal yet!";
      this.emptyMessage2 = "";
      this.emptyMessage3 = "Click on the + button to create your first Meal";
    } else {
      this.emptyMessage1 = "Oops, There are no Meals Available Now from this restaurant";
      this.emptyMessage2 = "Sorry for that !";
      this.emptyMessage3 = "Check other Restaurants Meals";
    }
  }

  public addNewMeal() {
    if (this.isMyRestaurantMeals) {
      this.openCreateMealModal();
    }
  }

  /**
   * Open create-meal modal for current logged in user
   */
  async openCreateMealModal() {
    const modal = await this.modalController.create({
      component: CreateMealModalPage,
      cssClass: 'create-meals-modal',
      componentProps: { restaurant_id: this.restaurant.id }
    });
    modal.onDidDismiss().then((response: any) => {
      // console.log(data);
      if (response && response.data) {
        if (response.data.status == "new-created" || response.data.status == "updated") {
          let newRestaurantMeal = response.data.meal;
          this.mealService.addOrUpdateRestaurantMeal(response.data.meal);
          console.log(newRestaurantMeal);
          // When adding new meal or update one, update Restaurants page to update the numbers
          this.restaurantService.clearCachedData();
          this.restaurantService.onRequestData(null, null);
        }
      }
    })
    return await modal.present();
  }

  public doRefresh(event) {
    // clear data
    // this.restaurantsList = [];
    this.mealService.clearCachedData();
    this.mealService.onRequestData(this.restaurant.id, null, event);
    // this.getRestaurantsData(event);

  }

  // to be called from a card after doing edit with many effects
  public refreshData(event) {
    // clear data
    this.mealService.clearCachedData();
    this.mealService.onRequestData( this.restaurant.id, null, null);
    // When adding new meal or update , delete, update Restaurants page to update the numbers
    this.restaurantService.clearCachedData();
    this.restaurantService.onRequestData(null, null);
  }

  public loadInfiniteData(event) {
    this.mealService.onRequestData(this.restaurant.id, event, null);
  }


  // Open the Current init Order details to confirm and finish or clear
  public openCurrentOrderPage(){
    // this.router.navigate(['order-details']);

    let navigationExtras: NavigationExtras = {
      state: {
        restaurant: this.restaurant
      }
    };
    this.router.navigate(['order-details'], navigationExtras);
  }

}
