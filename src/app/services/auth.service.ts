import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { User } from '../interfaces/user';
import { AuthResponse, GeneralResponse } from '../interfaces/auth-response';
import { Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { Router, NavigationExtras } from '@angular/router';


const TOKEN_KEY = 'ACCESS_TOKEN';
const USER_KEY = 'USER_KEY';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public authSubject$ = new BehaviorSubject<boolean>(null);
  public user$ = new BehaviorSubject<any>(null);


  private _userAuthToken: string = null;

  constructor(
    private httpClient: HttpClient,
    private platform: Platform,
    private storage: Storage,
    private router: Router,

  ) {
    // this.platform.ready().then(() => {
    //   // this.checkToken();
    // });
  }

  checkToken(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.storage.get(TOKEN_KEY).then(token => {
        if (token) {
          this.storage.get(USER_KEY).then(user => {
            // this.user = user;
            this.user$.next(user);
            this.authSubject$.next(true);
            resolve(true);
          })
        } else {
          this.authSubject$.next(false);
          this.user$.next(null);
          resolve(false);
        }
      })
    });
  }
  checkTokenForGuard(urlToOpen:string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.storage.get(TOKEN_KEY).then(token => {
        if (token) {
          this.storage.get(USER_KEY).then(user => {
            // this.user = user;
            this.user$.next(user);
            this.authSubject$.next(true);
            resolve(true);
          });
        } else {
          this.authSubject$.next(false);
          this.user$.next(null);
          //  trying to access guarded page
          if(urlToOpen && urlToOpen != "/home"){
            let navigationExtras: NavigationExtras = {
              queryParams: {
                urlToOpen:urlToOpen
              }
            };
            console.log("login with url");
            this.router.navigate(['login'],navigationExtras);
          }else{
            console.log("login just");
            this.router.navigate(['login']);
          }
          resolve(false);
        }
      })
    });

  }

  signup(user: User): Promise<AuthResponse> {
    let data = {
      email: user.email,
      password: user.password,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role
    };
    return this.httpClient.post<AuthResponse>(
      'auth/sign-up',
      data).toPromise().then(Response => this.processUserState(Response));

  }

  public resetPassword(token,password): Promise<AuthResponse>{
    let url = 'auth/reset-password';
    let data = {
      token: token,
      password: password
    };
    return this.httpClient
      .post<AuthResponse>(url, data)
      .toPromise()
      .then(response => this.processUserState(response));
  }
  public requestPasswordReset(email):Promise<GeneralResponse>{
    let baseUrl =  environment.reset_password_url;
    let url = 'auth/request-password-reset';
    let data = {
      email: email,
      baseUrl: baseUrl
    };

    return this.httpClient
      .post<GeneralResponse>(url, data)
      .toPromise();
  }
  public login(user: User): Promise<AuthResponse> {
    let url = 'auth/login';
    let data = {
      identity: user.email,
      password: user.password
    };
    return this.httpClient.post<AuthResponse>(
      url,
      data
    ).toPromise().then(response => this.processUserState(response));
  }

  public processUserState(response: AuthResponse): AuthResponse {

    if (response.errors) {
      return response;
    }

    if (response.auth_key && response.user) {
      this.storeUserAuthToken(response.auth_key);
      this.setUser(response.user);
      this.authSubject$.next(true);
    } else {
      this.authSubject$.next(false);
      this.user$.next(null);
    }


    return response;
  }

  public updateUserSettings(userSettings){

    // get user from storage
    // update user settings
    // set user 

    this.storage.get(USER_KEY).then(user => {
      // this.user = user;
      // console.log(user);
      user.user_settings = userSettings;
      // console.log(userSettings);
      this.setUser(user);
    });
  }

  public setUser(user: any) {
    this.user$.next(user);
    this.storage.set(USER_KEY, user);
  }

  public storeUserAuthToken(token: string) {
    this._userAuthToken = token;
    this.storage.set(TOKEN_KEY, token);
  }
  public getUserAuthToken(): Promise<string> {
    if (this._userAuthToken) {
      return new Promise(resolve => resolve(this._userAuthToken));
    }
    return this.storage.get(TOKEN_KEY);
  }

  async logout() {
    await this.storage.remove(TOKEN_KEY);
    await this.storage.remove(USER_KEY);
    // await this.storage.remove("EXPIRES_IN");
    this.authSubject$.next(false);
    this.router.navigate(['login']);
  }

  isLoggedIn() {
    return this.authSubject$.value;
  }
}
