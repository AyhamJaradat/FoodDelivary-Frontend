import { Injectable } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import Swal, { SweetAlertIcon } from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    public loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController) {

  }
  confirmSweetAlert(mTitle='',mMessage='', mType:SweetAlertIcon=undefined): Promise<any>{
    return new Promise(async (resolve, reject) => {
      Swal.fire({
        title: mTitle,//'Are you sure?',
        text: mMessage,//'You won\'t be able to revert this!',
        icon: mType,
        showCancelButton: true,
        confirmButtonColor: '#000',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',//'Yes, delete it!'
        customClass: {
          confirmButton: 'sweetConfirmButton',
          cancelButton: 'sweetCancelButton'
        },
        focusConfirm: false,
        // buttonsStyling:false
      }).then((result) => {
        if (result.value) {
          resolve('ok');
          // Swal.fire(
          //   'Deleted!',
          //   'Your file has been deleted.',
          //   'success'
          // )
        }else{
          resolve('cancel');
        }
      })

    });
   
  }

  // Not Used any more
  confirmAler(title='',message=''): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header:title,
        message: message,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (cancel) => {

              resolve('cancel');
            }
          }, {
            text: 'Okay',
            handler: (ok) => {

              resolve('ok');
            }
          }
        ]
      });

      alert.present();
    });
  }

  async presentSweetToast(message, show_button, position, duration,mType:SweetAlertIcon=undefined) {

    Swal.fire({
      position:position,// 'bottom',
      icon:mType,// 'success',
      title: message,
      showConfirmButton:show_button,// false,
      customClass: {
        title: 'sweetToastTitleClass'
      },
      // showClass: {
      //   // icon: 'swal2-icon-show'
      //   // icon: 'animated fadeInDown faster'
      // },
      
      timer:duration// 1500
    })
    // const toast = await this.toastController.create({
    //   message: message,
    //   showCloseButton: show_button,
    //   position: position,
    //   duration: duration
    // });
    // toast.present();
  }

  async presentToast(message, show_button, position, duration) {
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: show_button,
      position: position,
      duration: duration
    });
    toast.present();
  }

  async openLoader(message = '', duration = null) {
    const loading = await this.loadingController.create({
      message: message,
      duration: duration
    });
    await loading.present();
  }
  async closeLoading() {
    return await this.loadingController.dismiss();
  }


}
