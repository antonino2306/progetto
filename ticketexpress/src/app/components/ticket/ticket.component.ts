import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButton,
  IonItem,
  IonList,
  IonInput,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { UserService } from 'src/app/services/user.service';
import { star, starHalf, starOutline } from 'ionicons/icons';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButton,
    IonItem,
    IonList,
    IonInput,
    CommonModule,
    FormsModule,
    DatePipe
  ],
})
export class TicketComponent implements OnInit {
  statusTicket: boolean = true;
  @Input() eventName: string = '';
  @Input() ticketID: number = 0;
  @Input() location: string = '';
  @Input() date: number = 0;
  @Input() dateNC: number = 0;
  @Input() statusTicketDB: string = '';
  @Input() holderName: string = '';
  @Input() holderSurname: string = '';
  @Input() showID: number = 0;
  @Input() notExp: boolean = true;
  @Input() big: boolean = true;


  today = new Date();
  dateEvent = new Date(this.dateNC);

  newHolderName: string = '';
  newHolderSurname: string = '';

  changeNameVar: boolean = false;
  constructor(private userService: UserService) {
    addIcons({
      starOutline,
      star,
      starHalf,
    });
  }

  ngOnInit() {
    this.today = new Date();
    this.newHolderName = this.holderName;
    this.newHolderSurname = this.holderSurname;
    if (this.statusTicketDB === 'active') {
      this.statusTicket = false;
    } else if (this.statusTicketDB === 'expired') {
      this.statusTicket = true;
    }
    this.userService.getReviews();
  }

  changeName() {
    this.changeNameVar = !this.changeNameVar;
    this.newHolderName = '';
    this.newHolderSurname = '';
  }

  changeHolder() {
    this.changeNameVar = !this.changeNameVar;
    this.userService.changeTicketHolderName(
      this.ticketID,
      this.newHolderName,
      this.newHolderSurname
    );
 
    this.holderName = this.newHolderName;
    this.holderSurname = this.newHolderSurname;
  }

  exitChange() {
    this.changeNameVar = !this.changeNameVar;
    this.newHolderName = '';
    this.newHolderSurname = '';
  }
}
