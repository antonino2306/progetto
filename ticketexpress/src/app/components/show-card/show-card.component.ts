import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';

import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
  Platform,
  IonToast,
  IonLabel,
} from '@ionic/angular/standalone';
import { Show, Artist, EventService } from 'src/app/services/event.service';
import { CommonModule, DatePipe } from '@angular/common';
import { CartService } from 'src/app/services/cart.service';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  heart,
  heartOutline,
  linkOutline,
  shareOutline,
  addOutline,
  removeOutline,
  locationOutline,
  calendarOutline,
  timeOutline,
  ticketOutline,
  micOutline,
  peopleOutline,
  starOutline,
  star,
  starHalf,
  chatboxOutline,
} from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-show-card',
  templateUrl: './show-card.component.html',
  styleUrls: ['./show-card.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    DatePipe,
    IonButton,
    CommonModule,
    IonCardSubtitle,
    IonCardContent,
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonChip,
    IonToast,
    IonLabel,
  ],
})
export class ShowCardComponent {
  @Input() show: Show = {
    showID: 0,
    startDate: 0,
    endDate: 0,
    price: 0,
    availableTickets: 0,
    totalTickets: 0,
    locationName: '',
    locationCity: '',
    locationAddress: '',
    locationMaxCapacity: 0,
    locationCoords: '',
  };

  @Input() artists: Artist[] = [];
  @Input() eventTitle!: string;
  @Input() eventID!: number;
  reviews: any[] = []; // Placeholder for reviews, if needed

  isMobile: boolean = false;
  showButtons: boolean = false;
  quantity: number = 1;
  showDetails: boolean = false;
  isModalOpen: boolean = false;
  isFavorite: boolean = false;
  isEnded: boolean = false;

  isToastOpen: boolean = false;
  toastMessage: string = '';
  toastColor: string = 'success';

  private longitude: number = 0;
  private latitude: number = 0;
  private map!: L.Map;
  private marker: L.Marker | null = null;
  private favoritesSubs: Subscription = new Subscription();

  constructor(
    private cart: CartService,
    private userService: UserService,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,
    private platform: Platform
  ) {
    addIcons({
      heartOutline,
      heart,
      linkOutline,
      shareOutline,
      closeOutline,
      removeOutline,
      addOutline,
      locationOutline,
      calendarOutline,
      timeOutline,
      ticketOutline,
      micOutline,
      peopleOutline,
      chatboxOutline,
      starOutline,
      star,
      starHalf
    });
    this.isMobile =
      this.platform.is('mobile') ||
      this.platform.is('mobileweb') ||
      this.platform.is('android') ||
      this.platform.is('capacitor');
  }

  async ngOnInit() {
    this.latitude = parseFloat(this.show.locationCoords.split(',')[0] || '0');
    this.longitude = parseFloat(this.show.locationCoords.split(',')[1] || '0');

    console.log('longitude:', this.longitude);
    console.log('latitude:', this.latitude);

    this.favoritesSubs = this.userService.favorites.subscribe((favorites) => {
      // true se lo show è nei preferiti
      this.isFavorite = favorites.some(
        (favorite) => favorite.showID === this.show.showID
      );
    });

    try {
      this.artists = await this.eventService.fetchArtists(this.eventID);
      console.log('Artists fetched:', this.artists);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  }

  async ngOnChanges() {
    if (Date.now() > this.show.endDate) {
      this.isEnded = true;
      try {
        this.reviews = await this.eventService.getReviewByShowID(
          this.show.showID
        );
        console.log('Reviews fetched:', this.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }
  }

  updateQty(qty: number) {
    if (qty === -1 && this.quantity === 1) {
      return;
    }
    this.quantity += qty;
    console.log('Updated quantity:', this.quantity);
  }

  addToCart() {
    console.log('Adding to cart:', this.show.showID, this.quantity);
    this.cart.add(this.show.showID, this.quantity);
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;

    if (this.showDetails) {
      setTimeout(() => {
        if (!this.map) {
          this.initMap();
        }
      }, 300);
    }

    if (!this.showDetails) {
      this.destroyMap();
    }
  }

  toggleFavorite() {
    if (!this.authService.user.getValue()) {
      console.error('User not authenticated');
      this.router.navigate(['/login']);
      return;
    }

    try {
      if (this.isFavorite) {
        this.eventService.removeFromFavorites(this.show.showID);
        console.log('Removed from favorites:', this.show.showID);
        this.isFavorite = false;
      } else {
        this.eventService.addToFavorites(this.show.showID);
        console.log('Added to favorites:', this.show.showID);
        this.isFavorite = true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  async shareEvent() {
    const eventUrl = `http://localhost:8100/event/${this.eventID}`;

    try {
      // Prova prima con Capacitor
      await Clipboard.write({
        string: eventUrl,
      });
      this.showToast('URL copiato negli appunti!', 'success');
    } catch (error) {
      // Fallback per browser web
      try {
        await navigator.clipboard.writeText(eventUrl);
        this.showToast('URL copiato negli appunti!', 'success');
      } catch (fallbackError) {
        console.error('Errore durante la copia:', fallbackError);
        this.showToast('Errore durante la copia', 'danger');
      }
    }
  }

  private showToast(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.isToastOpen = true;
  }

  // Metodo chiamato quando il toast si chiude
  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  private initMap() {
    console.log('Inizializzazione della mappa con Leaflet');
    // Configurazione delle icone (fix per Ionic)
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
    });

    // Inizializzazione della mappa
    this.map = L.map(`map-${this.show.showID}`, {
      center: [this.latitude, this.longitude],
      zoom: 10,
      zoomControl: true,
      attributionControl: true,
    });

    // Aggiunta del layer delle tile
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Ridimensionamento automatico quando il container cambia
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
    this.addMarker();
  }

  private addMarker(): void {
    // Crea un nuovo marker alla posizione dell'evento
    this.marker = L.marker([this.latitude, this.longitude]).addTo(this.map)
      .bindPopup(`
      <strong>${this.eventTitle}</strong><br>
      ${this.show.locationName}<br>
      ${this.show.locationAddress}, ${this.show.locationCity}
    `);

    // Centra la mappa sul marker
    this.map.setView([this.latitude, this.longitude], 15);
  }

  destroyMap() {
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
    if (this.map) {
      this.map.remove();
      this.map = null as any; // Imposta a null per evitare errori di tipo
    }
  }

  ngOnDestroy() {
    this.favoritesSubs.unsubscribe();
    this.destroyMap();
  }

}
