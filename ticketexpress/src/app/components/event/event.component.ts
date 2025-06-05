import { Component, OnInit } from '@angular/core';
import {
  IonInput,
  IonItem,
} from '@ionic/angular/standalone';
import { IonList } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Event, EventService, Show } from 'src/app/services/event.service';
import { ShowCardComponent } from '../show-card/show-card.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  imports: [
    IonList,
    IonInput,
    IonItem,
    FormsModule,
    CommonModule,
    ShowCardComponent,
  ],
  standalone: true,
})
export class EventComponent implements OnInit {
  inputFavorite: string = '';
  favorites: Show[] = [];
  favoriteFiltered: Show[] = [];
  favoriteEventsInfo: Event[] = []; // Array per contenere le informazioni dettagliate degli eventi
  favoriteEventsInfoFiltered: Event[] = []; // Array per il filtro delle informazioni degli eventi

  private favoritesSubscription: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private eventService: EventService
  ) {}

  async ngOnInit() {
    this.userService.fetchFavorites();
    this.favoritesSubscription = this.userService.favorites.subscribe(
      async (favorites) => {
        this.favorites = favorites;
        this.favoriteFiltered = favorites;
        console.log('Favorites fetched:', this.favorites);

        if (favorites.length > 0) {
          await this.loadEventsInfo();
        }
      }
    );
  }

  private async loadEventsInfo() {
    try {
      const promises = this.favorites.map((favorite) => {
        return this.eventService.getEventInfo(favorite.showID);
      });

      this.favoriteEventsInfo = await Promise.all(promises);
      this.favoriteEventsInfoFiltered = this.favoriteEventsInfo; // Inizializza anche l'array filtrato
      console.log('Favorite events info:', this.favoriteEventsInfo);
    } catch (error) {
      console.error('Error fetching events info:', error);
    }
  }

  ngOnDestroy() {
    this.favoritesSubscription.unsubscribe();
  }

  filteringFavorites() {
    // const ricerca = event.target.value?.toLowerCase() || '';

    if (!this.inputFavorite) {
      // Se non c'è ricerca, mostra tutti
      this.favoriteFiltered = [...this.favorites];
      this.favoriteEventsInfoFiltered = [...this.favoriteEventsInfo];
    } else {
      const tmpFavoriteFiltered: Show[] = [];
      const tmpFavoriteEventsInfoFiltered: Event[] = [];

      this.favoriteEventsInfo.forEach((event, index) => {
        if (event.title.toLocaleLowerCase().includes(this.inputFavorite.toLocaleLowerCase())) {
          console.log(`Evento trovato: ${event.title}`);
          tmpFavoriteEventsInfoFiltered.push(event);
          tmpFavoriteFiltered.push(this.favorites[index]);
        }
      })

      this.favoriteFiltered = tmpFavoriteFiltered;
      this.favoriteEventsInfoFiltered = tmpFavoriteEventsInfoFiltered;

      console.log(`Filtrati ${this.favoriteFiltered.length} preferiti con la ricerca: "${this.inputFavorite}"`);

    }
  }
}
