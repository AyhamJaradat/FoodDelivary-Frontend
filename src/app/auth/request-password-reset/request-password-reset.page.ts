import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.page.html',
  styleUrls: ['./request-password-reset.page.scss'],
})
export class RequestPasswordResetPage implements OnInit {

  public form: FormGroup;
  public validation_messages;
  public isLoading: boolean = false;
  public isDone: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    protected formBuilder: FormBuilder,
    private menuCtrl: MenuController, ) { }

  ngOnInit() {
    this.initializeForm();
  }
  

  ionViewDidEnter() {
    this.menuCtrl.enable(false);
  }
  ionViewWillEnter(){
  }
  ionViewDidLeave(): void {
  }
  protected initializeForm() {
    this.form = this.formBuilder.group({
      email: ["", Validators.compose([Validators.required, Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]+$")])],
    });
    this.validation_messages = {
      'email': [
        { type: 'required', message: 'LOGIN.ERRORS.EMAIL.REQUIRED' },
        { type: 'pattern', message: 'LOGIN.ERRORS.EMAIL.INVALID' },
        { type: 'noSuchUser' , message :'LOGIN.ERRORS.EMAIL.NOT_USED'}
      ]
    };
  }
  /**
  * onSubmit
  */
  public onSubmitResetPassword(): void {
    if (this.form.invalid) {
      return;
    }
    this.loadingStart();

    let data = this.form.value;
    let authPromise = this.authService
      .requestPasswordReset(data.email);

    authPromise
      .then(response => {
        this.loadingStop();
        if (response.status){
          this.isDone = true;
        }else{
          console.log(response.errors)
          let errors = {};
          let newError: Object = {};
          newError["noSuchUser"] = true;
          let finalErrors = Object.assign(errors, newError);
          this.form.controls.email.setErrors(finalErrors);
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
