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
import { FooterComponent } from '../../components/footer/footer.component';
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
    CartComponent,
  ],
})
export class HomePage implements OnInit {
  popularEvents: Event[] = [];
  upComingEvents: Event[] = [];
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
    private platform: Platform
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

      this.popularEvents = eventsData.popularEvents.slice(0, 6);
      this.images = this.popularEvents
        .slice(0, 4)
        .map((event) => event.backgroundImage);
      this.upComingEvents = eventsData.upComingEvents.slice(0, 6);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  async ionViewWillEnter() {
    try {
      const [categories, favoriteCategories] = await Promise.all([
        await this.eventService.fetchCategories(),
        await this.userService.fetchFavoriteCategories(),
      ]);

      this.categories = categories;
      this.favoriteCategories = favoriteCategories;
      
      // Reset groupedEvents prima di popolare
      this.groupedEvents = {};
      
      if (this.favoriteCategories.length == 0) {
        this.favoriteCategories = this.categories.slice(6, 9);
      }
      console.log("Favorite categories: ", this.favoriteCategories);

      // Fetch eventi solo per le categorie preferite
      for (const category of this.favoriteCategories) {
        try {
          console.log(`Fetching events for category: ${category.name}`);
          const events = await this.eventService.fetchEventsByCategory(category.name);
          
          // Aggiungi solo se ci sono eventi per questa categoria
          if (events && events.length > 0) {
            this.groupedEvents[category.name] = events.slice(0, 6);
            this.expandedCategories[category.name] = false;
          }
        } catch (error) {
          console.error(`Error fetching events for category ${category.name}:`, error);
        }
      }

      // Separate la logica per le categorie mostrate nella UI
      if (this.isMobile) {
        this.categories = this.categories.slice(0, 3);
      } else {
        this.categories = this.categories.slice(0, 4);
      }
      
      console.log('Final groupedEvents:', this.groupedEvents);
      console.log('Number of categories in groupedEvents:', Object.keys(this.groupedEvents).length);
      
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
