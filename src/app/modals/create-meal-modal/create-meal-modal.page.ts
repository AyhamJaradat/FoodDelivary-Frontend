import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { RestaurantService } from '../../services/restaurant.service';
import { UtilService } from '../../services';
import { MealService } from '../../services/meal.service';

@Component({
	selector: 'app-create-meal-modal',
	templateUrl: './create-meal-modal.page.html',
	styleUrls: ['./create-meal-modal.page.scss'],
})
export class CreateMealModalPage {


	public modalTitle: string;
	public modalMessage: string;
	public isUpdate: boolean = false;
	public isUpdatedDone: boolean = false;

	public restaurant_id: number;


	public meal: any = {
		name: '',
		description: '',
		price: 0,
		restaurant_id: 0
	};
	constructor(
		private modalController: ModalController,
		private restaurantService: RestaurantService,
		private mealService: MealService,
		private navParams: NavParams,
		private utilService: UtilService
	) { }

	ionViewWillEnter() {
		// fill select options

		let isUpdateMeal = this.navParams.get('meal');

		if (isUpdateMeal) {
			this.isUpdate = true;
			this.meal = isUpdateMeal;
			this.modalTitle = 'Update Meal';
			this.modalMessage = '';
		} else {
			this.modalTitle = 'Create New Meal';
			this.modalMessage = '';
			this.restaurant_id = this.navParams.get('restaurant_id');
			this.meal.restaurant_id = this.restaurant_id;
		}
	}

	dismiss() {
		//no need to send on update as it changes by itself,,  a reference
		if (this.isUpdate && this.isUpdatedDone) {
			let meal = this.meal;
			this.modalController.dismiss({
				status: 'updated',
				meal: meal,
			});
		} else {
			this.modalController.dismiss();
		}
	}

	public createMeal() {
		this.meal.price = parseFloat(this.meal.price);
		if (this.meal.name.trim().length && this.meal.description.trim().length && this.isPriceValid(this.meal.price)) {
			this.mealService
				.createRestaurantMeal(this.meal)
				.subscribe((response: any) => {
					console.log(response);
					// do sissmiss, return the generated restaurant to be added to the list without need to refresh :)
					this.modalController.dismiss({
						status: 'new-created',
						meal: response,
					});
					this.utilService.presentSweetToast(
						'Created Successfully',
						false,
						'bottom',
						1500,
						'success'
					);
				},error=>{
					
				});
		} else {
			// show error toast
			if (this.isPriceValid(this.meal.price)) {
				this.utilService.presentToast('Please Fill all Fields', true, 'bottom', 2100);
			} else {
				this.utilService.presentToast('Make sure Price is a valid value', true, 'bottom', 2100);
			}

		}
	}

	public updateDetails() {
		this.meal.price = parseFloat(this.meal.price);
		if (this.meal.name.trim().length && this.meal.description.trim().length && this.isPriceValid(this.meal.price)) {
			this.mealService
				.updateRestaurantMealDetails(this.meal)
				.subscribe((response: any) => {
					
						this.isUpdatedDone = true;
						this.meal = response;
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
			if (this.isPriceValid(this.meal.price)) {
				this.utilService.presentToast('Please Fill all Fields', true, 'bottom', 2100);
			} else {
				this.utilService.presentToast('Make sure Price is a valid value', true, 'bottom', 2100);
			}
		}
	}

	public isPriceValid(price): boolean {

		if (typeof price == 'number' && price > 0) return true;
		else return false;
	}

}
