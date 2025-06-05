import { Component} from '@angular/core';
import { IonContent, IonIcon,IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { helpCircleOutline } from 'ionicons/icons';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
  standalone: true,
  imports: [IonContent,IonIcon,IonButton,RouterModule]
})
export class NotFoundPage {

  constructor() { 
    addIcons({ helpCircleOutline });
  }

}
