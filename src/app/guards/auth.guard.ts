import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,CanActivate, Router, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService, 
    private alertCtrl: AlertController
  ) { 

  }
  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
  
    console.log(routerStateSnapshot.url);
    let authState = this.auth.isLoggedIn();
    if(authState == null){
      // authState has not been check yet
      return this.auth.checkTokenForGuard(routerStateSnapshot.url);
    }else if(authState){
      return true;
    }else{
      if(routerStateSnapshot.url && routerStateSnapshot.url != "/home"){
        let navigationExtras: NavigationExtras = {
          queryParams: {
            urlToOpen:routerStateSnapshot.url
          }
        };
        console.log("login with url");
        this.router.navigate(['login'],navigationExtras);
      }else{
        console.log("login just");
        this.router.navigate(['login']);
      }
      return false;
    }
  }

}
