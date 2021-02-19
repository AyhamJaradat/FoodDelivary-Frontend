import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { PeopleService } from '../../services/people.service';
import { APP_CONSTANTS } from '../../interfaces/constants';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {

  public currentUser;

  public emptyMessage1: string;
  public emptyMessage2: string;
  public emptyMessage3: string;
 
  constructor(
    public router: Router,
    private menuCtrl: MenuController,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private peopleService: PeopleService,
    private modalController: ModalController,
  ) { 
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true);
  }
  ionViewWillEnter(){
  }

  ngOnInit() {

    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if(this.currentUser != null){
        if(this.currentUser.userRole == APP_CONSTANTS.REGULAR_USER_ROLE ){
          // page not allowed
          this.doInitialization(false);
        }else{
          //APP_CONSTANTS.OWNER_USER_ROLE
          this.doInitialization(true);
        }
 
      }
    });
    
  }

  public doInitialization(isOwner){

    this.peopleService.clearCachedData();
    this.peopleService.onRequestData(null,null);
    this.initilizeEmptyMessageTest(isOwner);
  }

  public initilizeEmptyMessageTest(isOwner) {
    if (isOwner) {
      this.emptyMessage1 = "";
      this.emptyMessage2 = "You Have No Customers Yet !";
      this.emptyMessage3 = "";
    } else {
      this.emptyMessage1 = "Oops, This Page is only for Owners";
      this.emptyMessage2 = "You should not be here";
      this.emptyMessage3 = "Run ...!";
    }
  }

  public doRefresh(event) {
    // clear data
    this.peopleService.clearCachedData();
    this.peopleService.onRequestData(null,event);

  }

   // to be called from a card after doing edit with many effects
   public refreshData(event) {
    // clear data
    this.peopleService.clearCachedData();
    this.peopleService.onRequestData(null,null);
  }

  public loadInfiniteData(event){
    this.peopleService.onRequestData(event,null);
  }

  public blockCustomer(customer, isBlocked){
    if(isBlocked){
      // Un block
      this.peopleService.updateBlockUser(customer.id,APP_CONSTANTS.NO).subscribe((res:any)=>{
        if(res.status){
          let newCustomer = res.data;
          this.peopleService.addOrUpdateCustomer(newCustomer);
        }
   
      });
    }else{
      // block
      this.peopleService.updateBlockUser(customer.id,APP_CONSTANTS.YES).subscribe((res:any)=>{
        if(res.status){
          let newCustomer = res.data;
          this.peopleService.addOrUpdateCustomer(newCustomer);
        }
      });
    }
  }



}
