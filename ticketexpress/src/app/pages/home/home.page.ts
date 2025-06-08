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
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { PanelComponent } from 'src/app/components/panel/panel.component';
import { SearchbarComponent } from 'src/app/components/searchbar/searchbar.component';
import { CardComponent } from 'src/app/components/card/card.component';
import { EventService, Event, Category } from '../../services/event.service';
import { RouterLink, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, chevronDownOutline } from 'ionicons/icons';
import { UserService } from 'src/app/services/user.service';
import { Platform } from '@ionic/angular';
import { FooterComponent } from "../../components/footer/footer.component";
import { CartComponent } from 'src/app/components/cart/cart.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    HeaderComponent,
    PanelComponent,
    SearchbarComponent,
    CardComponent,
    RouterLink,
    FooterComponent,
    CartComponent
],
})

export class HomePage implements OnInit {


  popularEvents: Event[] = [];
  upComingEvents: Event[] = []
  images: string[] = [];
  categories: Category[] = [];
  favoriteCategories: Category[] = [];
  groupedEvents: { [key: string]: Event[] } = {};

  expandedPopular: boolean = false;
  expandedUpcoming: boolean = false;
  expandedCategories: { [key: string]: boolean } = {};
  isMobile: boolean = false;


  constructor(
    private eventService: EventService,
    private userService: UserService,
    private platform: Platform,
  ) {
    addIcons({
      chevronForwardOutline,
      chevronDownOutline,
    });

    this.isMobile =
      this.platform.is('mobile') ||
      this.platform.is('mobileweb') ||
      this.platform.is('capacitor') ||
      this.platform.is('android');
  }

  async ngOnInit() {
    try {
      const eventsData = await this.eventService.fetchEvents();

      const [categories, favoriteCategories] = await Promise.all([
        await this.eventService.fetchCategories(),
        await this.userService.fetchFavoriteCategories(),
      ]);

      this.popularEvents = eventsData.popularEvents.slice(0, 6);
      this.images = this.popularEvents.slice(0,4).map(event => event.backgroundImage)
      this.upComingEvents = eventsData.upComingEvents.slice(0, 6);
      this.categories = categories;
      this.favoriteCategories = favoriteCategories;

      if (this.favoriteCategories.length == 0) {
        this.favoriteCategories = this.categories.slice(6, 9);
      }

      // Prepara un array di promise per il fetch degli eventi per ogni categoria
      const eventFetchPromises = this.favoriteCategories.map(
        async ({ name }) => {
          const events = await this.eventService.fetchEventsByCategory(name);
          return { name, events };
        }
      );

      // Attendi il completamento di tutte le promise
      const results = await Promise.all(eventFetchPromises);

      // Popola l'oggetto groupedEvents con i risultati
      results.forEach(({ name, events }) => {
        this.groupedEvents[name] = events.slice(0, 6);
        this.expandedCategories[name] = false;
      });

      if (this.isMobile) {
        this.categories = this.categories.slice(0, 3);
      } else {
        this.categories = this.categories.slice(0, 4);
      }
      console.log('Fetched events:', this.groupedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  togglePopularExpansion() {
    if (!this.isMobile) {
      this.expandedPopular = !this.expandedPopular;
    }
  }

  toggleUpcomingExpansion() {
    if (!this.isMobile) {
      this.expandedUpcoming = !this.expandedUpcoming;
    }
  }

  toggleCategoryExpansion(category: string) {
    if (!this.isMobile) {
      this.expandedCategories[category] = !this.expandedCategories[category];
    }
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  
}
