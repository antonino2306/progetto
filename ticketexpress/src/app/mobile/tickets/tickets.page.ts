import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonCol,
  IonRow,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { TicketComponent } from 'src/app/components/ticket/ticket.component';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { CalendarComponent } from 'src/app/components/calendar/calendar.component';
import { addIcons } from 'ionicons';
import { calendarOutline, listOutline } from 'ionicons/icons';
import { CartComponent } from 'src/app/components/cart/cart.component';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonGrid,
    IonRow,
    IonCol,
    TicketComponent,
    IonButton,
    IonIcon,
    CalendarComponent,
    CartComponent
  ],
})
export class TicketsPage implements OnInit {
  
  tickets: any[] = [];
  isCalendarViewActive: boolean = false;
  private subs: Subscription = new Subscription();
  constructor(private userService: UserService) {
    addIcons({ calendarOutline, listOutline })
  }

  ngOnInit() {

    this.userService.fetchTickets();

    this.subs.add(
      this.userService.tickets.subscribe((tickets) => {
        this.tickets = tickets.filter(tick => tick.status !== 'expired');
        console.log(this.tickets);
      })
    )
  }

  toggleCalendarView() {
    console.log('Toggle calendar view');
    this.isCalendarViewActive = !this.isCalendarViewActive;
  }

  ngOnDeestroy() {
    this.subs.unsubscribe();
  }
}
