import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { UtilService } from '../../services';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
	selector: 'app-create-restaurant-modal',
	templateUrl: './create-restaurant-modal.page.html',
	styleUrls: ['./create-restaurant-modal.page.scss'],
})
export class CreateRestaurantModalPage {

	public modalTitle: string;
	public modalMessage: string;
	public isUpdate: boolean = false;
	public isUpdatedDone: boolean = false;


	public restaurant: any = {
		name: '',
		description: '',
	};

	constructor(
		private modalController: ModalController,
		private restaurantService: RestaurantService,
		private navParams: NavParams,
		private utilService: UtilService
	) { }

	ionViewWillEnter() {
		// fill select options

		let isUpdateRestaurant = this.navParams.get('restaurant');
		if (isUpdateRestaurant) {
			this.isUpdate = true;
			this.updateRestaurantAsInGiven(isUpdateRestaurant);
			this.modalTitle = 'Update Restaurant';
			this.modalMessage = '';
		} else {
			this.modalTitle = 'Create New Restaurant';
			this.modalMessage = 'Create a Restaurant, So people can order Food';
		}
	}


	dismiss() {
		//no need to send on update as it changes by itself,,  a reference
		if (this.isUpdate && this.isUpdatedDone) {
			let response = this.restaurant;
			this.modalController.dismiss({
				status: 'updated',
				restaurant: response,
			});
		} else {
			this.modalController.dismiss();
		}
	}

	public createRestaurant() {
		if (this.restaurant.name.trim().length && this.restaurant.description.trim().length) {
			this.restaurantService
				.createRestaurant(this.restaurant)
				.subscribe((response: any) => {
					console.log(response);
					// do sissmiss, return the generated restaurant to be added to the list without need to refresh :)
					this.modalController.dismiss({
						status: 'new-created',
						restaurant: response,
					});
					this.utilService.presentSweetToast(
						'Created Successfully',
						false,
						'bottom',
						1500,
						'success'
					);
				});
		} else {
			// show error toast
			this.utilService.presentToast('Please Fill all Fields', true, 'bottom', 2100);
		}
	}

	public updateDetails() {
		if (this.restaurant.name.trim().length && this.restaurant.description.trim().length) {
			this.restaurantService
				.updateRestaurantDetails(this.restaurant)
				.subscribe((response: any) => {
					
						this.isUpdatedDone = true;
						this.updateRestaurantAsInGiven(response);
						console.log(response);
						this.dismiss();
						// show updated successfully
						this.utilService.presentSweetToast(
							'Updated Successfully',
							false,
							'bottom',
							1500,
							'success'
						);
				
				});
		} else {
			// show error toast, cannot be empty
			this.utilService.presentToast(
				'Please Fill All Fields',
				true,
				'bottom',
				2100
			);
		}
	}



	private updateRestaurantAsInGiven(resRestaurant) {
		this.restaurant = resRestaurant;
	}
}
