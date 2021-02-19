import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilService } from '../../services';
import { RestaurantService } from '../../services/restaurant.service';
import { CreateRestaurantModalPage } from '../../modals/create-restaurant-modal/create-restaurant-modal.page';
import { APP_CONSTANTS } from '../../interfaces/constants';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss'],
})
export class RestaurantCardComponent implements OnInit {

  @Input() restaurant;
  @Input() isMyRestaurant;

  @Output() onNeedRefresh: EventEmitter<number> = new EventEmitter();

  constructor(
    private modalController: ModalController,
    private utilService: UtilService,
    private restaurantService: RestaurantService,
    private orderService:OrderService
  ) { }

  ngOnInit() {
    if (this.isMyRestaurant) {
      // For my Restaurant Cards

    } else {
      // for regular Users Restaurant Cards

    }

  }

  public editRestaurant(event: Event) {
    event.stopPropagation();
    // show model of criteria
    if (this.isMyRestaurant)
      this.openCreateRestaurantModal();
  }

  /**
 *  To open the Edit restaurant modal
 */
  async openCreateRestaurantModal() {
    const modal = await this.modalController.create({
      component: CreateRestaurantModalPage,
      // showBackdrop:true,??
      cssClass: ['create-restaurant-modal', 'edit'],
      componentProps: { restaurant: this.restaurant }
    });
    modal.onDidDismiss().then((response: any) => {
      // console.log(data);
      if (response && response.data) {
        if (response.data.status == "updated") {
          let newRestaurant = response.data.restaurant;
          this.restaurant = newRestaurant;
          console.log(newRestaurant);
        }
      }
    })
    return await modal.present();
  }

  public deleteRestaurant(event: Event) {
    event.stopPropagation();
    if (this.isMyRestaurant) {
      // show alert ? are you sure
      // this.utilService.confirmSweetAlert();
      if (this.restaurant.is_deleted == APP_CONSTANTS.NO) {
        // to delete this.utilService.confirmAler
        this.utilService.confirmSweetAlert('Confirm!', 'Are you sure you want to delete this Restaurant', 'question').then(res => {
          if (res === 'ok') {
            this.restaurantService.deleteRestaurant(this.restaurant.id, 1).subscribe(
              (response: any) => {
                console.log(response);
                if (response && response.is_deleted == 1) {
                  this.restaurant = response;
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
}
