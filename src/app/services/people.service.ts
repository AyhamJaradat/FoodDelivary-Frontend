import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  public isSpinner: boolean = false;
  public customersList = [];
  public dataHolder={
      data: null,
      pageCount: 1,
      finished: false,
  }
  
  constructor(private httpClient: HttpClient) { }

  public onRequestData(infint, refresher) {
    if (infint === null && this.dataHolder.data != null && refresher === null) {
      this.customersList = this.dataHolder.data;
    } else if (this.dataHolder.data === null) {
      this.customersList = [];
    }
    this.fetchAllCustomers(infint, refresher);
    return;
  }

  public fetchAllCustomers(infint, refresher){
  
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
   

      this.getCustomersList(this.dataHolder.pageCount).subscribe(
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
      this.customersList = res.body;
      this.dataHolder.data = this.customersList;
    }else{
      this.customersList = this.dataHolder.data;
      if (this.customersList.length < number) {
        for (let i in res.body) {
          // make sure items does not duplicate
          let isAlreadyExists = false;
          for (var j = 0; j < this.customersList.length; j++) {
            if (this.customersList[j].id == res.body[i].id) {
              // update existing group with retrieved one
              this.customersList[j] = res.body[i];
              isAlreadyExists = true;
              break;
            }
          }
          if (!isAlreadyExists) {
            // only add new groups that was not already requested
            this.customersList.push(res.body[i]);
          }
  
        }
      }
    }
    if (this.customersList.length == number) {
      this.dataHolder.finished = true;
    } else if (this.customersList.length < number) {
      this.dataHolder.pageCount = this.dataHolder.pageCount + 1;
    }
    this.isSpinner = false;
  }

  public clearCachedData() {
    this.customersList = [];
    this.dataHolder.data= null;
    this.dataHolder.pageCount= 1;
    this.dataHolder.finished=false;
  }

  public addOrUpdateCustomer(customer) {
    let isAdd = true;
    for (let i = 0; i < this.customersList.length; i++) {
      if (this.customersList[i].id == customer.id) {
        this.customersList[i] = customer;
        isAdd = false;
        break;
      }
    }
    if (isAdd) {
      // push at first index
      // this.restaurantsList.unshift(restaurant);
      if(this.dataHolder.data== null){
        this.dataHolder.data =[customer];
      }else{
        this.dataHolder.data.unshift(customer);
      }
    }
  }

   //customers-list
   public getCustomersList(page = 1000) {
    return this.httpClient.get('user/customers-list?page='+page, {observe: 'response' });
  }

  public getBlockedCustomers(page=1000){
    return this.httpClient.get('user/blocked-customers-list?page='+page, {observe: 'response' });
  }

  public updateBlockUser(customerId, isBlock){
    let body = {
      customer_id: customerId,
      is_block:isBlock
    }
    return this.httpClient.post('user/update-block-user', body);
  }
}
