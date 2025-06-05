import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-error-server-page',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './error-server-page.page.html',
  styleUrls: ['./error-server-page.page.scss']
})
export class ErrorServerPage {

  constructor() {
    addIcons({ alertCircleOutline });
  }
}
