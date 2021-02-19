import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {



  // Object to hold regular user current order that is not placed yet
  public initOrder: any = {
    status: 0,
    user_id: 0,
    restaurant_id: 0,
    selected_meals: [],
    total_num_of_meals:0,
    total_price:0
  }

  public initOrderMemo ={};

  // For orders-list page
  public isSpinner: boolean = false;
  public ordersList = [];
  public dataHolder={
      data: null,
      pageCount: 1,
      finished: false,
  }

  constructor(private httpClient: HttpClient) { }


  public onRequestData(infint, refresher) {
    if (infint === null && this.dataHolder.data != null && refresher === null) {
      this.ordersList = this.dataHolder.data;
    } else if (this.dataHolder.data === null) {
      this.ordersList = [];
    }
    this.fetchAllOrders(infint, refresher);
    return;
  }

  public fetchAllOrders(infint, refresher){
  
    if (this.dataHolder.finished) {
      if (infint != null) {
        infint.target.complete();
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
   

      this.getOrdersList(this.dataHolder.pageCount).subscribe(
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
      this.ordersList = res.body;
      this.dataHolder.data = this.ordersList;
    }else{
      this.ordersList = this.dataHolder.data;
      if (this.ordersList.length < number) {
        for (let i in res.body) {
          // make sure items does not duplicate
          let isAlreadyExists = false;
          for (var j = 0; j < this.ordersList.length; j++) {
            if (this.ordersList[j].id == res.body[i].id) {
              // update existing group with retrieved one
              this.ordersList[j] = res.body[i];
              isAlreadyExists = true;
              break;
            }
          }
          if (!isAlreadyExists) {
            // only add new groups that was not already requested
            this.ordersList.push(res.body[i]);
          }
  
        }
      }
    }
    if (this.ordersList.length == number) {
      this.dataHolder.finished = true;
    } else if (this.ordersList.length < number) {
      this.dataHolder.pageCount = this.dataHolder.pageCount + 1;
    }
    this.isSpinner = false;
  }

  public clearCachedData() {
    this.ordersList = [];
    this.dataHolder.data= null;
    this.dataHolder.pageCount= 1;
    this.dataHolder.finished=false;
  }

  // to be used after creating an order ,, or changing an order status
  public addOrUpdateOrder(order) {
    let isAdd = true;
    for (let i = 0; i < this.ordersList.length; i++) {
      if (this.ordersList[i].id == order.id) {
        this.ordersList[i] = order;
        isAdd = false;
        break;
      }
    }
    if (isAdd) {
      // push at first index
      // this.restaurantsList.unshift(restaurant);
      if(this.dataHolder.data== null){
        this.dataHolder.data =[order];
      }else{
        this.dataHolder.data.unshift(order);
      }
    }
  }

   //orders-list
   public getOrdersList(page = 1000) {
    return this.httpClient.get('order/orders-list?page='+page, {observe: 'response' });
  }


  public getPendingActionOrders(page = 1000){
    return this.httpClient.get('order/pending-action-list?page='+page, {observe: 'response' });
  }

  // to change order status
  public updateOrderStatus(order_id,status) {
    let body = {
      status: status
    }
    return this.httpClient.put('order/'+order_id, body);
  }

  
  public getAnOrder(order_id){
    return this.httpClient.get('order/'+order_id);
  }


  public clearInitOrder():Promise<boolean>{

    return new Promise(resolve => {

      this.initOrder ={
        status: 0,
        user_id: 0,
        restaurant_id: 0,
        selected_meals: [],
        total_num_of_meals:0,
        total_price:0
      };
      this.initOrderMemo ={};
      resolve(true);
  });
  }

  public addMealToInitOrder(meal) {
    if (this.initOrder.selected_meals.length == 0) {
      this.initializeInitOrder(meal.restaurant_id);
    }
    // if first time push with count=1
    // else increment count
    let theMeal=  this.initOrder.selected_meals.find(mealElement => mealElement.id == meal.id);
    if(theMeal){
      theMeal.count++;
      this.initOrderMemo[meal.id]++;
      this.initOrder.total_price +=meal.price;
    }else{
      meal.count=1;
      this.initOrder.selected_meals.push(meal);
      this.initOrderMemo[meal.id] =1;
      this.initOrder.total_price +=meal.price;
    }
    this.initOrder.total_num_of_meals++;
   

  }

  public removeMealFromInitOrder(meal) {
    this.initOrder.selected_meals.find(mealElement => mealElement.id == meal.id);

    for (let i = 0; i < this.initOrder.selected_meals.length; i++) {

      if (this.initOrder.selected_meals[i].id == meal.id) {
        // only when there is data in this tab
        let theMeal =this.initOrder.selected_meals[i];
        if(theMeal.count>1){
          theMeal.count--;
          this.initOrderMemo[meal.id]--;
          this.initOrder.total_price -=meal.price;
        } else{
          this.initOrder.selected_meals.splice(i, 1);
          this.initOrderMemo[meal.id] =0;
          this.initOrder.total_price -=meal.price;
        }
       
        break;
      }
    }
    this.initOrder.total_num_of_meals--;

    if(this.initOrder.selected_meals.length == 0){
      this.clearInitOrder();
    }
  }

  public initializeInitOrder(restaurant_id) {
    this.initOrder.restaurant_id = restaurant_id;
  }



  public createOrder(body){
    return this.httpClient.post('order', body);
  }
}
