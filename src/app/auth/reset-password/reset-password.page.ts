import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthResponse } from '../../interfaces/auth-response';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  /**
   * if I am authinticated and in,, and I open a reset password link 
   * :: should I ignore reset and redirect to home ?
   * :: should I do logout and then redirect to reset pass?
   * :: should I continue normally ? 
   * the reset will work for the user of the token , not the user logged in , so it should be okay to continue normally
   * 
   */
  public form: FormGroup;
  public validation_messages;
  public isLoading: boolean = false;
  public token: string;
  constructor(
    private authService: AuthService,
    protected formBuilder: FormBuilder,
    private router: Router,
    private menuCtrl: MenuController,
    private activatedRoute: ActivatedRoute ) { }

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe(params => this.token = params['token'] || null);
    if(this.token == null || this.token == "" || this.token.length < 5){
      // not valid token 
      console.log("not valid token");
      // show alert
      // redirect to login page
      this.router.navigate(['login']);
    }else{
      this.initializeForm();
    }
   
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false);
  }
  ionViewWillEnter() {
  }
  ionViewDidLeave(): void {
  }
  protected initializeForm() {
    this.form = this.formBuilder.group({
      token: [this.token, Validators.required],
      password: ['',  Validators.compose([
        Validators.required,
        Validators.minLength(6),
      ])],
    });
    this.validation_messages = {
      'password': [
        { type: 'required', message: 'LOGIN.ERRORS.PASSWORD.REQUIRED' },
        { type: 'minlength', message: 'LOGIN.ERRORS.PASSWORD.MINIMUM' },
        { type: 'notValidToken' , message :'LOGIN.ERRORS.PASSWORD.NOT_VALID_TOKEN'}
      ],
  
    };
  }
  public onSubmitResetPassword(): void {

    if (this.form.invalid){
      return;
    }
    this.loadingStart();

    let data = this.form.value;
    let authPromise = this.authService
      .resetPassword(data.token, data.password);

    authPromise
      .then( (response:AuthResponse) => {
        this.loadingStop();
        if (response.errors) {
          // is the token invalid ?
          if(response.errors.token && response.errors.token[0] == "Invalid password reset token."){
            console.log("invalid token");
            let errors = {};
            let newError: Object = {};
            newError["notValidToken"] = true;
            let finalErrors = Object.assign(errors, newError);
            this.form.controls.password.setErrors(finalErrors);
            // show alert , invalid or expired token, ask to reset your password again.
            // on alert Ok clicked/dismissed then
            // redirect to login page
          }else{
            // TODO: show unexpected error message
            // navigate to login after clicking okay
          }
        }else{
          // show alert password reset succsessfuly, with button "Home Page"
          // redirect should happen when click on home page or alert dissmissed
          this.router.navigate(['home']);
        }
     
      })
      .catch((response: HttpErrorResponse) => {
        this.loadingStop();
        let errors = JSON.parse(response.error.message);
        console.log(errors);
      })
  }

  protected loadingStart() {
    this.isLoading = true;
    this.setControlsDisabledState(true);
  }

  protected loadingStop() {
    this.isLoading = false;
    this.setControlsDisabledState(false);
  }
  protected setControlsDisabledState(isDisabled: boolean) {
    Object.keys(this.form.controls)
      .forEach(key => {
        let control = this.form.get(key);
        if (isDisabled)
          control.disable();
        else
          control.enable();
      });
  }

}
