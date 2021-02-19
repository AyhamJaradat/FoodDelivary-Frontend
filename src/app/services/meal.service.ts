import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MealService {

  public isSpinner: boolean = false;
  public mealsList = [];
  public dataHolder={
      data: null,
      pageCount: 1,
      finished: false,
  }

  constructor(private httpClient: HttpClient) { }

  public onRequestData(restaurant_id, infint, refresher) {
    if (infint === null && this.dataHolder.data != null && refresher === null) {
      this.mealsList = this.dataHolder.data;
    } else if (this.dataHolder.data === null) {
      this.mealsList = [];
    }
    this.fetchAllRestaurantMeals(restaurant_id,infint, refresher);
    return;
  }

  public fetchAllRestaurantMeals(restaurant_id,infint, refresher){
  
    if (this.dataHolder.finished) {
      if (infint != null) {
        infint.target.complete();
        // infint.target.disabled = true;
      }
      // finish the current refresher if exists
      if (refresher != null) {
        refresher.target.complete();
      }
      return;
    }
    if (this.dataHolder.data === null && refresher == null) {
      this.isSpinner = true;
    }
    
  

      this.getRestaurantMealsList(restaurant_id,this.dataHolder.pageCount).subscribe(
        (res:any) => {
          let x = res.headers.get("X-Pagination-Total-Count");
          this.onSuccess(x, res);
       
          // finish the current infint if exists
          if (infint != null) {
            infint.target.complete();
          }
          // finish the current refresher if exists
          if (refresher != null) {
            refresher.target.complete();
          }
          this.isSpinner = false;

        }, error => {
          console.log(error);
       
          if (infint != null) {
            infint.target.complete();
          }
          // finish the current refresher if exists
          if (refresher != null) {
            refresher.target.complete();
          }
          this.isSpinner = false;
        }
      )
  }

  public onSuccess(number, res) {
    if (this.dataHolder.data === null) {
      this.mealsList = res.body;
      this.dataHolder.data = this.mealsList;
    }else{
      this.mealsList = this.dataHolder.data;
      if (this.mealsList.length < number) {
        for (let i in res.body) {
          // make sure items does not duplicate
          let isAlreadyExists = false;
          for (var j = 0; j < this.mealsList.length; j++) {
            if (this.mealsList[j].id == res.body[i].id) {
              // update existing group with retrieved one
              this.mealsList[j] = res.body[i];
              isAlreadyExists = true;
              break;
            }
          }
          if (!isAlreadyExists) {
            // only add new groups that was not already requested
            this.mealsList.push(res.body[i]);
          }
  
        }
      }
    }
    if (this.mealsList.length == number) {
      this.dataHolder.finished = true;
    } else if (this.mealsList.length < number) {
      this.dataHolder.pageCount = this.dataHolder.pageCount + 1;
    }
    this.isSpinner = false;
  }

  public clearCachedData() {
    this.mealsList = [];
    this.dataHolder.data= null;
    this.dataHolder.pageCount= 1;
    this.dataHolder.finished=false;
  }

  public addOrUpdateRestaurantMeal(meal) {
    let isAdd = true;
    for (let i = 0; i < this.mealsList.length; i++) {
      if (this.mealsList[i].id == meal.id) {
        this.mealsList[i] = meal;
        isAdd = false;
        break;
      }
    }
    if (isAdd) {
      // push at first index
      if(this.dataHolder.data== null){
        this.dataHolder.data =[meal];
      }else{
        this.dataHolder.data.unshift(meal);
      }
    }
  }


  //meal-list
  public getRestaurantMealsList(restaurant_id,page = 1000) {
    return this.httpClient.get('meal/meal-list?page='+page, { params: { restaurant_id:restaurant_id },observe: 'response' });
  }


  public createRestaurantMeal(meal) {
    return this.httpClient.post('meal', meal);
  }

  public updateRestaurantMealDetails(meal) {
    let body = {
      name: meal.name,
      description: meal.description,
      price:meal.price
    }
    return this.httpClient.put('meal/'+meal.id, body);
  }

  /**
   * Deleting a meal is just an updating on its is_deleted field 
   * @param restaurant_id 
   * @param isDelete 
   */
  public deleteRestaurantMeal(meal_id,isDelete=1){
      let body = {
        is_deleted: isDelete
      }
      return this.httpClient.put('meal/'+meal_id, body);
    }
}
