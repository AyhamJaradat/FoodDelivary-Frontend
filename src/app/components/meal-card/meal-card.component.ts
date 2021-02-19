import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilService } from '../../services';
import { MealService } from '../../services/meal.service';
import { CreateMealModalPage } from '../../modals/create-meal-modal/create-meal-modal.page';
import { APP_CONSTANTS } from '../../interfaces/constants';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'meal-card',
  templateUrl: './meal-card.component.html',
  styleUrls: ['./meal-card.component.scss'],
})
export class MealCardComponent implements OnInit {

  @Input() meal;
  @Input() isMyRestaurantMeal;
  @Input() isInitialOrder;
  @Input() isInsideOrderPage;

  @Output() onNeedRefresh: EventEmitter<number> = new EventEmitter();
  constructor(
    private modalController: ModalController,
    private utilService: UtilService,
    private mealService: MealService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    if (this.isMyRestaurantMeal) {
      // For my Restaurant Meals Cards
      this.isInitialOrder = false;
    } else {
      // for regular Users Restaurant Meals Cards

    }
  }

  public editRestaurantMeal(event: Event) {
    event.stopPropagation();
    // show model of create Restaurant
    if (this.isMyRestaurantMeal)
      this.openCreateRestaurantMealModal();
  }

  /**
*  To open the Edit restaurant meal modal
*/
  async openCreateRestaurantMealModal() {
    const modal = await this.modalController.create({
      component: CreateMealModalPage,
      // showBackdrop:true,??
      cssClass: ['create-meals-modal', 'edit'],
      componentProps: { meal: this.meal }
    });
    modal.onDidDismiss().then((response: any) => {
      // console.log(data);
      if (response && response.data) {
        if (response.data.status == "updated") {
          let newRestaurantMeal = response.data.meal;
          this.meal = newRestaurantMeal;
          console.log(newRestaurantMeal);
        }
      }
    })
    return await modal.present();
  }
  public deleteRestaurantMeal(event: Event) {
    event.stopPropagation();
    if (this.isMyRestaurantMeal) {
      // show alert ? are you sure
      // this.utilService.confirmSweetAlert();
      if (this.meal.is_deleted == APP_CONSTANTS.NO) {
        // to delete this.utilService.confirmAler
        this.utilService.confirmSweetAlert('Confirm!', 'Are you sure you want to delete this Meal', 'question').then(res => {
          if (res === 'ok') {
            this.mealService.deleteRestaurantMeal(this.meal.id, 1).subscribe(
              (response: any) => {
                console.log(response);
                if (response && response.is_deleted == 1) {
                  this.meal = response;
                  // we need to refresh the whole page
                  // or at least remove this card
                  this.onNeedRefresh.emit(1);
                } else {
                  // error happend
                }
              }
            );
          }
        });
      }

    }
  }

  public addMealToOrder(event: Event) {
    event.stopPropagation();
    if (!this.isMyRestaurantMeal && this.isInitialOrder) {
      // Check if the initOrder started and is with this restaurant
      if (this.orderService.initOrder.restaurant_id == 0 || this.orderService.initOrder.restaurant_id == this.meal.restaurant_id) {
        this.orderService.addMealToInitOrder(this.meal);
      } else {
        // trying to add a meal from another restaurant
        // show alert
         // to delete this.utilService.confirmAler
         this.utilService.confirmSweetAlert('Warning!!, You already started Ordering from a different Restaurant!', 'Do you want to clear that Order and start One from this restaurant?', 'question').then(res => {
          if (res === 'ok') {
            this.orderService.clearInitOrder().then(()=>{
              this.orderService.addMealToInitOrder(this.meal);
            });
          }
        });

      }


    }

  }

  public removeMealFromOrder(event: Event) {
    event.stopPropagation();
    if (!this.isMyRestaurantMeal && this.isInitialOrder) {
      if (this.orderService.initOrderMemo[this.meal.id] > 0) {
        this.orderService.removeMealFromInitOrder(this.meal);
      }
    }

  }

}
