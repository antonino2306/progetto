import { Component, OnInit } from '@angular/core';
import {
  IonInput,
  IonItem,
  IonTitle,
  Platform,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TicketComponent } from '../ticket/ticket.component';
import { ShowReviewComponent } from '../show-review/show-review.component';

@Component({
  selector: 'app-all-ticket',
  templateUrl: './all-ticket.component.html',
  styleUrls: ['./all-ticket.component.scss'],
  imports: [
    IonTitle,
    IonInput,
    IonItem,
    FormsModule,
    CommonModule,
    TicketComponent,
    ShowReviewComponent,
  ],
})
export class AllTicketComponent implements OnInit {
  inputTicket: string = '';
  inputTicketExp: string = '';
  tickets: any[] = [];
  ticketNotExpired: any[] = [];
  ticketExpired: any[] = [];
  groupedExpiredTickets: any = {};
  showSmallTicket: boolean = true;

  showReviewStates: {
    [showId: string]: {
      isReview: boolean;
      reviewContent: string;
      reviewDesc: string;
      reviewRate: number;
      rating: number;
      canReview: boolean;
      confirmedReview: boolean;
    };
  } = {};

  stars = Array(5).fill(0);
  showID: number = 0;
  dateNC: number = 0;
  ticketID: number = 0;
  isMobile : boolean = false;

  today = new Date();

  private ticketsSubscription: Subscription = new Subscription();
  private reviewSubscription: Subscription = new Subscription();
  reviews: any[] = [];

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
      this.tickets = tickets;

      this.ticketNotExpired = tickets.filter(
        (ticket) => ticket.status === 'active'
      );
      this.ticketExpired = tickets.filter(
        (ticket) => ticket.status === 'expired'
      );
    });

    this.userService.getReview();
    this.reviewSubscription = this.userService.reviews.subscribe((reviews) => {
      this.reviews = reviews;
    });
  }

  ngOnDestroy() {
    this.ticketsSubscription.unsubscribe();
    this.reviewSubscription.unsubscribe();
  }

  filterTickets(event: any) {
    const ricerca = event.target.value?.toLowerCase() || '';
    this.ticketNotExpired = this.tickets.filter((ev) => {
      if (ev.status !== 'active') return false;
      const nomeCompleto = `${ev.holderName || ''} ${
        ev.holderSurname || ''
      }`.toLowerCase();
      const nomeCompletoRev = `${ev.holderSurname || ''} ${
        ev.holderName || ''
      }`.toLowerCase();
      const title = ev.title.toLowerCase();
      return (
        nomeCompleto.includes(ricerca) ||
        nomeCompletoRev.includes(ricerca) ||
        title.includes(ricerca)
      );
    });
  }
}
