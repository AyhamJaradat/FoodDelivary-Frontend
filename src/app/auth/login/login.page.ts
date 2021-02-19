import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from  "@angular/router";
import { AuthService } from '../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

   /**
   * @var FormGroup
   */
  public form: FormGroup;
  public validation_messages;
  public urlToOpen:string ='';

    /**
   * @var boolean
   */
  public isLoading: boolean = false;
  /**
   * @var boolean
   */
  public operationSuccess: boolean = false;

  constructor(
    private  authService:  AuthService,
    private  router:  Router,
    private formBuilder: FormBuilder,
    private menuCtrl: MenuController,
    private activatedRoute: ActivatedRoute
  ) {

   }

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe(params => this.urlToOpen = params['urlToOpen'] || '/home');
    // initialize form only once
    this.initializeForm();
  }
  ionViewDidEnter() {
    this.menuCtrl.enable(false);
    // if open login page while authinticated go to home page
    let authState = this.authService.isLoggedIn();
    if (authState == null) {
      // authState has not been check yet
      this.authService.checkToken().then(value => {
        if(value === true){
          this.router.navigate(['home']);
        }
      });
    } else if (authState === true) {
      this.router.navigate(['home']);
    }
  }
  ionViewDidLeave(): void {
  }

  ionViewWillEnter(){
    // clear form fields
    this.form.reset();
    this.isLoading = false;
    this.operationSuccess=false;
  }
   /**
   * Initialize Form
   */
  protected initializeForm() {
    this.form = this.formBuilder.group({
      email: ["", Validators.compose([
        Validators.required,
        Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]+$")])],
      password: ["", Validators.compose([
        Validators.required,
        Validators.minLength(6),
      ])],
    });


    this.validation_messages = {
      'email': [
        { type: 'required', message: 'LOGIN.ERRORS.EMAIL.REQUIRED' },
        { type: 'pattern', message: 'LOGIN.ERRORS.EMAIL.INVALID'  }
      ],
      'password': [
        { type: 'required', message: 'LOGIN.ERRORS.PASSWORD.REQUIRED' },
        { type: 'minlength', message: 'LOGIN.ERRORS.PASSWORD.MINIMUM' },
        { type: 'noSuchUser' , message :'LOGIN.ERRORS.PASSWORD.WRONG'}
      ],

    };


  }

  onSubmitLogin():void{
    if (this.form.invalid){
      return;
    }
    this.loadingStart();
    let data = this.form.value;
    let authPromise = this.authService.login(data);

    authPromise.then(response => {
       // Any errors?
       this.loadingStop();
       if (response.errors) {

        // there is an error in the login ,, show wrong password error
        let errors = {};
        let newError: Object = {};
        newError["noSuchUser"] = true;
        let finalErrors = Object.assign(errors, newError);
        this.form.controls.password.setValue('');
        this.form.controls.password.updateValueAndValidity();
        this.form.controls.password.setErrors(finalErrors);
      } else {
        this.operationSuccess = true;
        this.router.navigateByUrl(this.urlToOpen);
      }

    }).catch(error =>{

    });
  }

  protected loadingStart() {
    this.isLoading = true;
  }

  protected loadingStop() {
    this.isLoading = false;
  }



}
