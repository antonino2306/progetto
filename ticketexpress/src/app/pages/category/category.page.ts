import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  Platform,
} from '@ionic/angular/standalone';
import { CardComponent } from 'src/app/components/card/card.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Event, EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { addIcons } from 'ionicons';
import { gridOutline, listOutline } from 'ionicons/icons';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    CommonModule,
    FormsModule,
    IonGrid,
    IonRow,
    IonCol,
    CardComponent,
    RouterLink,
    HeaderComponent,
    FooterComponent
],
})
export class CategoryPage implements OnInit {
  category: string = '';
  events: Event[] = [];
  isExpanded: boolean = false;
  isMobile: boolean = false;

  private subs: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private event: EventService,
    private platform: Platform
  ) {
    addIcons({ gridOutline, listOutline });
    this.isMobile =
      this.platform.is('mobile') ||
      this.platform.is('mobileweb') ||
      this.platform.is('capacitor') ||
      this.platform.is('android');
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log(params['category']);
      this.category = params['category'];
      this.loadEvents();
    });
  }

  private async loadEvents() {
    this.events = await this.event.fetchEventsByCategory(this.category);
  }

  toggleExpandedView() {
    this.isExpanded = !this.isExpanded;
  }
}
