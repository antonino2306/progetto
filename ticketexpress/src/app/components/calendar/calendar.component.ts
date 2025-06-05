import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  chevronBack,
  chevronForward,
  timeOutline,
} from 'ionicons/icons';
import { Show } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';
import { TicketComponent } from '../ticket/ticket.component';

interface CalendarEvent {
  ticketID: number;
  holderName: string;
  holderSurname: string;
  status: string;
  title: string;
  name: string;
  orderID: number;
  locationName: string;
  startDate: number;
  endDateNC: number;
}

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvents: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonIcon,
    IonItem,
    CommonModule,
    IonLabel,
    IonCardHeader,
    IonButton,
    TicketComponent,
  ],
})
export class CalendarComponent implements OnInit {
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  selectedDate: Date | null = null;
  selectedDateEvents: CalendarEvent[] = [];
  calendarDays: CalendarDay[] = [];
  events: CalendarEvent[] = [];
  isTicketVisible: boolean = false;

  monthNames = [
    'Gennaio',
    'Febbraio',
    'Marzo',
    'Aprile',
    'Maggio',
    'Giugno',
    'Luglio',
    'Agosto',
    'Settembre',
    'Ottobre',
    'Novembre',
    'Dicembre',
  ];

  dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

  constructor(private userService: UserService) {
    addIcons({ calendarOutline, timeOutline, chevronForward, chevronBack });
  }

  ngOnInit() {
    this.events = this.userService.tickets.getValue();
    console.log(this.events);
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  generateCalendar(month: number, year: number) {
    this.calendarDays = [];

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      // const dateString = this.formatDate(currentDate);
      const dayEvents = this.events.filter((event) => {
        return (
          this.normalizeDate(new Date(event.startDate)).getTime() ===
          this.normalizeDate(currentDate).getTime()
        );
      });

      this.calendarDays.push({
        date: new Date(currentDate),
        day: currentDate.getDate(),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: this.isToday(currentDate),
        hasEvents: dayEvents.length > 0,
        events: dayEvents,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  // Oppure normalizzando a mezzanotte:
  private normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  onDayClick(day: CalendarDay) {
    console.log('Selected day:', day);
    this.selectedDate = day.date;
    this.selectedDateEvents = day.events;
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  goToToday() {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  getFormattedSelectedDate(): string {
    if (!this.selectedDate) return '';

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return this.selectedDate.toLocaleDateString('it-IT', options);
  }

  toggleTicketVisibility() {
    this.isTicketVisible = !this.isTicketVisible;
  }
}
