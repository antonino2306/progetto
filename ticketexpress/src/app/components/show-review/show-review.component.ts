import { Component, Input, OnInit } from '@angular/core';
import { IonInput, IonItem, IonTitle, IonCard, IonCardTitle, IonCardSubtitle, IonCardContent, IonCardHeader, IonButton, IonIcon, IonList, Platform } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TicketComponent } from "../ticket/ticket.component";


@Component({
  selector: 'app-show-review',
  templateUrl: './show-review.component.html',
  styleUrls: ['./show-review.component.scss'],
  imports: [IonTitle, IonInput, IonItem, IonCard,IonCardTitle, IonCardSubtitle, IonCardContent, IonCardHeader,  IonButton, IonIcon, IonList, FormsModule, CommonModule, TicketComponent],

})
export class ShowReviewComponent  implements OnInit {

  // Variabili per inserire tutti i ticket, filtrarli in quelli expired e tutte le review
  ticketExpired : any[] = [];
  ticketExpiredOriginal : any[] = []; // Array originale per la ricerca
  showTicketExpired : any[] = [];
  showTicketExpiredOriginal : any[] = []; // Array originale degli show per la ricerca
  reviews : any[] = [];
  groupedShows: any[] = []; // Array che contiene un oggetto per ogni showID unico

  // Variabile per la ricerca
  inputTicketExp : string = '';


  isReview: boolean = false;
  reviewContent: string = '';
  reviewDesc: string = '';
  reviewRate: number = 0;
  rating: number = 0;
  canReview: boolean  = false;
  confirmedReview: boolean  = false;
  stars = Array(5).fill(0);
  @Input() showID: number = 0;
  dateNC: number = 0;
  ticketID : number = 0;
  today = new Date();
  isMobile : boolean = false;

  // Oggetti per gestire rating e contenuto per ogni show separatamente
  showRatings: { [showID: number]: number } = {};
  showReviewContents: { [showID: number]: string } = {};

  private ticketsSubscription: Subscription = new Subscription();
  private reviewSubscription : Subscription = new Subscription(); 
  

  constructor(private userService: UserService, private platform: Platform) { 
    this.isMobile =
      this.platform.is('mobile') ||
      this.platform.is('mobileweb') ||
      this.platform.is('capacitor') ||
      this.platform.is('android');
  }

  ngOnInit() {
    this.userService.fetchTickets();

    this.ticketsSubscription = this.userService.tickets.subscribe((tickets) => {
      this.ticketExpired = tickets.filter(ticket => ticket.status === 'expired');
      this.ticketExpiredOriginal = [...this.ticketExpired]; // Salva l'array originale
      this.showTicketExpired = this.ticketExpired.filter((ticket, index, self) =>
        index === self.findIndex(t => t.showID === ticket.showID)
      );
      this.showTicketExpiredOriginal = [...this.showTicketExpired]; // Salva l'array originale degli show
    });

    this.userService.getReview();
    this.reviewSubscription = this.userService.reviews.subscribe((reviews) => {
      this.reviews = reviews;
    });


  }

  ngOnDestroy(){
    this.ticketsSubscription.unsubscribe();
    this.reviewSubscription.unsubscribe();
  }

  filteringTicketsExp(event: any) {
    const ricerca = event.target.value?.toLowerCase() || '';
    
    if (ricerca === '') {
      // Se la ricerca è vuota, mostra tutti i ticket expired originali
      this.ticketExpired = [...this.ticketExpiredOriginal];
      this.showTicketExpired = [...this.showTicketExpiredOriginal];

    } else {
      // Filtra basandosi sull'array originale
      this.ticketExpired = this.ticketExpiredOriginal.filter((ticket) => {
        // Ricerca per titolo del concerto
        const title = ticket.title.toLowerCase();
        
        // Ricerca per Nome Cognome
        const nomeCompleto = `${ticket.holderName || ''} ${ticket.holderSurname || ''}`.toLowerCase();
        
        // Ricerca per Cognome Nome
        const cognomeNome = `${ticket.holderSurname || ''} ${ticket.holderName || ''}`.toLowerCase();
        
        return title.includes(ricerca) || 
               nomeCompleto.includes(ricerca) || 
               cognomeNome.includes(ricerca);
      });

      // Filtra gli show per mostrare solo quelli che hanno almeno un ticket che corrisponde ai criteri
      const showIDsWithMatchingTickets = [...new Set(this.ticketExpired.map(ticket => ticket.showID))];
      this.showTicketExpired = this.showTicketExpiredOriginal.filter(show => 
        showIDsWithMatchingTickets.includes(show.showID)
      );
    }
  }

  getStarIcon(index: number, showID: number): string {
    const reviewRate = this.showRatings[showID] || 0;
    if (reviewRate >= index + 1) {
      return 'star';
    } else if (reviewRate > index) {
      return 'star-half';
    } else {
      return 'star-outline';
    }
  }

  getStarIconForReview(index: number, rate: number): string {
    if (rate >= index + 1) {
      return 'star';
    } else if (rate > index) {
      return 'star-half';
    } else {
      return 'star-outline';
    }
  }

  setShowID(showID : number){
    this.showID = showID;
    this.rating = 0; // Reset rating quando cambi show
    this.reviewContent = ''; // Reset anche il contenuto
  }
  sendReview(showID: number) {
    const rating = this.showRatings[showID] || 0;
    const content = this.showReviewContents[showID] || '';
    
    if (rating === 0 || content.trim() === '') {
      console.error('Rating o contenuto mancante');
      return;
    }
    
    this.userService.newReview(showID, rating, content);
    
    // Reset dopo l'invio
    delete this.showRatings[showID];
    delete this.showReviewContents[showID];
  }

  onStarClick(event: MouseEvent, index: number, showID: number) {
    const target = event.target as HTMLElement;
    const bounds = target.getBoundingClientRect();
    const clickX = event.clientX - bounds.left;
    const isLeftHalf = clickX < bounds.width / 2;
    this.showRatings[showID] = index + (isLeftHalf ? 0.5 : 1);
    console.log(`voto per show ${showID}: ${this.showRatings[showID]}/5`);
  }

  hasReviewForShow(showID: number): boolean {
    return this.reviews.some(review => review.showID === showID);
  }

  getReviewForShow(showID: number): any {
    return this.reviews.find(review => review.showID === showID);
  }
  
  updateReviewContent(showID: number, content: string) {
    this.showReviewContents[showID] = content;
  }

  getReviewContent(showID: number): string {
    return this.showReviewContents[showID] || '';
  }
}
