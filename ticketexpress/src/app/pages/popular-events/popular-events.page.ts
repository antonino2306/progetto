import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonRow,
  Platform,
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CardComponent } from 'src/app/components/card/card.component';
import { RouterLink } from '@angular/router';
import { Event, EventService } from 'src/app/services/event.service';
import { addIcons } from 'ionicons';
import { gridOutline, listOutline } from 'ionicons/icons';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-popular-events',
  templateUrl: './popular-events.page.html',
  styleUrls: ['./popular-events.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
    IonGrid,
    IonCol,
    IonRow,
    CardComponent,
    RouterLink,
    IonButton,
    IonIcon,
    FooterComponent
],
})
export class PopularEventsPage implements OnInit {
  isExpanded: boolean = false;
  isMobile: boolean = false;
  events: Event[] = [];

  constructor(private platform: Platform, private eventService: EventService) {
    this.isMobile =
      this.platform.is('mobile') ||
      this.platform.is('mobileweb') ||
      this.platform.is('capacitor') ||
      this.platform.is('android');

      addIcons({ gridOutline, listOutline });
  }

  ngOnInit() {
    this.eventService.popularEvents.subscribe((events) => {
      this.events = events;
    });
  }

  toggleExpandedView() {
    if (!this.isMobile) {
      this.isExpanded = !this.isExpanded;
    }
  }
}
