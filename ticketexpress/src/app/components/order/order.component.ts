import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonButton,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import {
  barcodeOutline,
  calendarOutline,
  chevronDownOutline,
  chevronUpOutline,
  locationOutline,
  personOutline,
  receiptOutline,
  ticketOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonCard,
    IonCardHeader,
    IonButton,
    IonCardTitle,
    IonIcon,
  ],
})
export class OrderComponent implements OnInit {
  ordineID: number | null = null;
  userOrders: any[] = [];
  userOrdersFiltered: any[] = [];
  showDetails: boolean = false;
  selectedOrderID: number | null = null;
  selectedOrderDetails: any = null;

  inputTicket: string = '';
  tickets: any[] = [];
  ticketFiltered: any[] = [];
  showSmallTicket: boolean = true;

  private ordersSubscription: Subscription = new Subscription();
  private ticketsSubscription: Subscription = new Subscription();

  constructor(private userService: UserService) {
    addIcons({
      barcodeOutline,
      personOutline,
      receiptOutline,
      chevronUpOutline,
      chevronDownOutline,
      ticketOutline,
      calendarOutline,
      locationOutline,
    });
  }

  ngOnInit() {
    this.userService.fetchOrders();
    this.ordersSubscription = this.userService.orders.subscribe((orders) => {
      this.userOrders = orders;
      this.userOrdersFiltered = [...orders];
    });

    this.userService.fetchTickets();
    this.ticketsSubscription = this.userService.tickets.subscribe((tickets) => {
      this.tickets = tickets;
      this.ticketFiltered = this.tickets.filter(
        (ticket, index, self) =>
          index === self.findIndex((t) => t.orderID === ticket.orderID)
      );
    });

    console.log(this.userOrders);
  }

  ngOnDestroy() {
    this.ticketsSubscription.unsubscribe();
    this.ordersSubscription.unsubscribe();
  }

  toggleOrderDetails(orderID: number) {
    this.showDetails = !this.showDetails;

    if (this.showDetails) {
      this.getOrderDetails(orderID);
    }
  }
  // Funzione per ottenere i dettagli di un ordine specifico
  getOrderDetails(orderID: number) {
    this.selectedOrderID = orderID;

    // Filtra i biglietti per questo ordine specifico
    const orderTickets = this.tickets.filter(
      (ticket) => ticket.orderID === orderID
    );

    // Trova l'ordine specifico
    const order = this.userOrders.find((order) => order.orderID === orderID);

    // Crea un oggetto con tutti i dettagli dell'ordine
    this.selectedOrderDetails = {
      orderInfo: order,
      tickets: orderTickets,
      totalTickets: orderTickets.length,
      uniqueShows: this.getUniqueShows(orderTickets),
    };

    console.log('Dettagli ordine:', this.selectedOrderDetails);
    return this.selectedOrderDetails;
  }

  // Funzione per ottenere gli spettacoli unici di un ordine
  private getUniqueShows(tickets: any[]): any[] {
    const uniqueShows = tickets.reduce((acc, ticket) => {
      const existingShow = acc.find(
        (show: any) => show.showID === ticket.showID
      );
      if (!existingShow) {
        acc.push({
          showID: ticket.showID,
          title: ticket.title,
          startDate: ticket.startDate,
          locationName: ticket.locationName,
          ticketsForThisShow: tickets.filter((t) => t.showID === ticket.showID)
            .length,
        });
      }
      return acc;
    }, []);

    return uniqueShows;
  }

  // Funzione per mostrare i dettagli di un ordine specifico
  showDetailsForOrder(orderID: number) {
    this.getOrderDetails(orderID);
    this.showDetails = true;
  }

  // Funzione per nascondere i dettagli
  hideDetailsForOrder() {
    this.showDetails = false;
    this.selectedOrderID = null;
    this.selectedOrderDetails = null;
  }

  // Funzione per verificare se un ordine è quello selezionato
  isOrderSelected(orderID: number): boolean {
    return this.selectedOrderID === orderID && this.showDetails;
  }
}
