import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { ShowCardComponent } from 'src/app/components/show-card/show-card.component';
import { EventService, Show, Event } from 'src/app/services/event.service';
import { CartComponent } from "../../components/cart/cart.component";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule, IonGrid, IonRow, IonCol, ShowCardComponent, CartComponent]
})
export class FavoritesPage implements OnInit {

  favorites: Show[] = [];
  eventsInfo: Event[] = [];
  private subs: Subscription = new Subscription();
  constructor(private userService: UserService, private eventService: EventService) { }

  //todo aggiungere il recupero dei dati dell'artista basandosi sullo showID
  async ngOnInit() {
    this.subs.add(
      this.userService.favorites.subscribe(async (favorites) => {
        
        this.favorites = favorites;
        
        if (favorites.length > 0) {
          await this.loadEventsInfo();
        }
        console.log(this.favorites);
      })
    )

  }

    private async loadEventsInfo() {
    try {
      const promises = this.favorites.map((favorite) => {
        return this.eventService.getEventInfo(favorite.showID);
      });

      this.eventsInfo = await Promise.all(promises);
      console.log('Favorite events info:', this.eventsInfo);
    } catch (error) {
      console.error('Error fetching events info:', error);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
