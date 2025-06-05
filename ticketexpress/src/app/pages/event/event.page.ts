import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonLabel,
  IonRow,
  Platform,
} from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Artist,
  Event,
  EventService,
  Show,
} from 'src/app/services/event.service';
import { HeaderComponent } from '../../components/header/header.component';
import { PanelComponent } from '../../components/panel/panel.component';
import { Subscription } from 'rxjs';
import { ShowCardComponent } from 'src/app/components/show-card/show-card.component';
import { FooterComponent } from "../../components/footer/footer.component";
import { ImageService } from 'src/app/services/image.service';
import { addIcons } from 'ionicons';
import { informationCircleOutline, micOutline, musicalNotesOutline } from 'ionicons/icons';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
    PanelComponent,
    ShowCardComponent,
    CommonModule,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonLabel,
    IonCardTitle,
    IonCardContent,
    IonCardHeader,
    FooterComponent,
    IonChip,
    IonIcon
],
})
export class EventPage implements OnInit {
  event: Event | null = null;
  shows: Show[] = [];
  artists: Artist[] = [];
  isMobile: boolean = false;

  private subs: Subscription = new Subscription();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private imageService: ImageService,
    private platform: Platform
  ) {
    this.isMobile =
      this.platform.is('mobile') ||
      this.platform.is('mobileweb') ||
      this.platform.is('android');

      addIcons({musicalNotesOutline, micOutline, informationCircleOutline})
  }

  async ngOnInit() {
    const eventID: number = parseInt(this.activatedRoute.snapshot.paramMap.get('id') || '');
    this.event = this.router.getCurrentNavigation()?.extras.state?.[
      'event'
    ] as Event;

    console.log('Event ID:', eventID);

    this.subs.add(
      this.eventService.fetchEventDetails(eventID).subscribe({
        next: (shows) => (this.shows = shows),
        error: (err) => console.error(err),
      })
    );

    try {
      if (!this.event) {
        this.event = await this.eventService.getEventInfoByID(eventID);
      }
      this.artists = await this.eventService.fetchArtists(eventID);
      this.artists[0].image = this.imageService.getArtistImageUrl(this.artists[0].image);
      console.log('Artists fetched:', this.artists);
    }
    catch (error) {
      console.error('Error fetching artists:', error);
    }


  }

  ngOnDestroy() {
    // annulla tutte le sottoscrizioni
    this.subs.unsubscribe();
  }
}
