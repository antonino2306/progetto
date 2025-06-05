import { inject, Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ErrorService {

  router = inject(Router);

  constructor(private alertController: AlertController){}

  async handleHttpError(error: any) {
    if (error.status == 0) {
      this.router.navigate(['/error-server-page']);
    }
    else if (error.status == 500) {
      this.router.navigate(['/error-server-page']);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
