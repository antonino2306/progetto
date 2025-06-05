import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  Platform,
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    CommonModule,
    FormsModule,
    HeaderComponent,
  ]
})
export class FAQPage implements OnInit {

  isMobile: boolean = false;

  constructor(private platform: Platform) {
    this.isMobile = this.platform.is('mobile') || this.platform.is('mobileweb');
  }

  ngOnInit() {
  }

}
