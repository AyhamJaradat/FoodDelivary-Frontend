import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  public isSpinner: boolean = false;
  public restaurantsList = [];
  public dataHolder={
      data: null,
      pageCount: 1,
      finished: false,
  }

  constructor(private httpClient: HttpClient) { }


  public onRequestData(infint, refresher) {
    if (infint === null && this.dataHolder.data != null && refresher === null) {
      this.restaurantsList = this.dataHolder.data;
    } else if (this.dataHolder.data === null) {
      this.restaurantsList = [];
    }
    this.fetchAllRestaurants(infint, refresher);
    return;
  }

  public fetchAllRestaurants(infint, refresher){
  
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
   

      this.getRestaurantsList(this.dataHolder.pageCount).subscribe(
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
      this.restaurantsList = res.body;
      this.dataHolder.data = this.restaurantsList;
    }else{
      this.restaurantsList = this.dataHolder.data;
      if (this.restaurantsList.length < number) {
        for (let i in res.body) {
          // make sure items does not duplicate
          let isAlreadyExists = false;
          for (var j = 0; j < this.restaurantsList.length; j++) {
            if (this.restaurantsList[j].id == res.body[i].id) {
              // update existing group with retrieved one
              this.restaurantsList[j] = res.body[i];
              isAlreadyExists = true;
              break;
            }
          }
          if (!isAlreadyExists) {
            // only add new groups that was not already requested
            this.restaurantsList.push(res.body[i]);
          }
  
        }
      }
    }
    if (this.restaurantsList.length == number) {
      this.dataHolder.finished = true;
    } else if (this.restaurantsList.length < number) {
      this.dataHolder.pageCount = this.dataHolder.pageCount + 1;
    }
    this.isSpinner = false;
  }

  public clearCachedData() {
    this.restaurantsList = [];
    this.dataHolder.data= null;
    this.dataHolder.pageCount= 1;
    this.dataHolder.finished=false;
  }

  public addOrUpdateRestaurant(restaurant) {
    let isAdd = true;
    for (let i = 0; i < this.restaurantsList.length; i++) {
      if (this.restaurantsList[i].id == restaurant.id) {
        this.restaurantsList[i] = restaurant;
        isAdd = false;
        break;
      }
    }
    if (isAdd) {
      // push at first index
      // this.restaurantsList.unshift(restaurant);
      if(this.dataHolder.data== null){
        this.dataHolder.data =[restaurant];
      }else{
        this.dataHolder.data.unshift(restaurant);
      }
    }
  }


  //restaurant-list
  public getRestaurantsList(page = 1000) {
    return this.httpClient.get('restaurant/restaurant-list?page='+page, {observe: 'response' });
  }


  public createRestaurant(restaurant) {
    return this.httpClient.post('restaurant', restaurant);
  }

  public updateRestaurantDetails(restaurant) {
    let body = {
      name: restaurant.name,
      description: restaurant.description
    }
    return this.httpClient.put('restaurant/'+restaurant.id, body);
  }

  /**
   * Deleting a Restaurant is just an updating on its is_deleted field 
   * @param restaurant_id 
   * @param isDelete 
   */
  public deleteRestaurant(restaurant_id,isDelete=1){
      let body = {
        is_deleted: isDelete
      }
      return this.httpClient.put('restaurant/'+restaurant_id, body);
    }


    public getARestaurant(restaurant_id){
        return this.httpClient.get('restaurant/'+restaurant_id);
    }
  
}
