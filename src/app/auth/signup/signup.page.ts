import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { APP_CONSTANTS } from '../../interfaces/constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  /**
  * @var FormGroup
  */
  public form: FormGroup;
  public validation_messages;

  /**
* @var boolean
*/
  public isLoading: boolean = false;
  /**
   * @var boolean
   */
  public operationSuccess: boolean = false;

  public isRegularUser:boolean=true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    this.initializeForm();
  }
  ionViewDidEnter() {
    this.menuCtrl.enable(false);
    // if open signup page while authinticated go to home page
    let authState = this.authService.isLoggedIn();
    if (authState == null) {
      // authState has not been check yet
      this.authService.checkToken().then(value => {
        if (value === true) {
          this.router.navigate(['home']);
        }
      });
    } else if (authState === true) {
      this.router.navigate(['home']);
    }

  }

  ionViewWillEnter() {
    // every time we open the login page, we should clear the fields
    // clear form fields
    this.form.reset();
    this.isRegularUser = true;
    this.changeRadio(this.isRegularUser);
    this.isLoading = false;
    this.operationSuccess = false;

  }
  ionViewDidLeave(): void {
    // did leave is called after the next page already did enter
    // so if that page disabled the menu , then this action will re enable it
    // this.menuCtrl.enable(true);
  }

  /**
   * Initialize Form
   */
  protected initializeForm() {
    this.form = this.formBuilder.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      email: ["", Validators.compose([
        Validators.required,
        Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]+$")])],
      password: ["", Validators.compose([
        Validators.required,
        Validators.minLength(6),
      ])],
      role :[APP_CONSTANTS.REGULAR_USER_ROLE, Validators.required],
    });

    this.validation_messages = {
      'firstname': [
        { type: 'required', message: 'REGISTER.ERRORS.FIRSTNAME.REQUIRED' },
        { type: 'errorFromServer', message: '' }
      ],
      'lastname': [
        { type: 'required', message: 'REGISTER.ERRORS.LASTNAME.REQUIRED' },
        { type: 'errorFromServer', message: '' }
      ],
      'email': [
        { type: 'required', message: 'LOGIN.ERRORS.EMAIL.REQUIRED' },
        { type: 'pattern', message: 'LOGIN.ERRORS.EMAIL.INVALID' },
        { type: 'taken', message: 'REGISTER.ERRORS.EMAIL.TAKEN' },
        { type: 'errorFromServer', message: '' }
      ],
      'password': [
        { type: 'required', message: 'LOGIN.ERRORS.PASSWORD.REQUIRED' },
        { type: 'minlength', message: 'LOGIN.ERRORS.PASSWORD.MINIMUM' },
        { type: 'errorFromServer', message: '' }
      ],

    };


  }

  public changeRadio(isRegular){
    this.isRegularUser = isRegular;
    if(this.isRegularUser){
      this.form.controls.role.setValue(APP_CONSTANTS.REGULAR_USER_ROLE);
    }else{
      this.form.controls.role.setValue(APP_CONSTANTS.OWNER_USER_ROLE);
    }
   
  }

  onSubmitRegister(): void {
    if (this.form.invalid) {
      return;
    }
    this.isLoading= true;
    let data = this.form.value;
    this.authService.signup(data).then((response) => {
      // Any errors?
      this.isLoading=false;
      if (response.errors) {
        Object.keys(response.errors).forEach(controlKey => {
          response.errors[controlKey].forEach(errorMessage => {

            // email error : no valid ,, or taken 
            let errorIn = null;
            if (controlKey == "email") {

              switch (errorMessage) {
                case "Email is not a valid email address.":
                  errorIn = "pattern";
                  break;
                case "This email address has already been taken.":
                  errorIn = "taken";
                  break;
              }
              let errors = this.form.controls[controlKey].errors;
              if (errors == null)
                errors = {};
              let newError: Object = {};
              if (errorIn != null) {
                newError[errorIn] = true;
              } else {
                newError['errorFromServer'] = true;
                for (let i = 0; i < this.validation_messages[controlKey].length; i++) {
                  if (this.validation_messages[controlKey][i].type == "errorFromServer") {
                    this.validation_messages[controlKey][i].message = errorMessage;
                  }
                }
              }
              this.form.controls[controlKey].setErrors(Object.assign(errors, newError));
            } else {
              let errors = this.form.controls[controlKey].errors;
              if (errors == null)
                errors = {};
              let newError: Object = {};
              newError['errorFromServer'] = true;
              let finalErrors = Object.assign(errors, newError);

              for (let i = 0; i < this.validation_messages[controlKey].length; i++) {
                if (this.validation_messages[controlKey][i].type == "errorFromServer") {
                  this.validation_messages[controlKey][i].message = errorMessage;
                }
              }
              this.form.controls[controlKey].setErrors(finalErrors);
            }
          });
        });
      } else {
        this.operationSuccess = true;
        this.router.navigate(['home']);
      }

    }).catch(error => {
    });
  }

}
