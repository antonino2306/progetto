import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  Platform,
  IonIcon,
  IonPopover,
} from '@ionic/angular/standalone';
import {
  IonCard,
  IonItem,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonInput,
  IonCardSubtitle,
  IonCardTitle,
  IonList,
} from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { OrderComponent } from 'src/app/components/order/order.component';
import { EventComponent } from '../../components/event/event.component';
import { AllTicketComponent } from 'src/app/components/all-ticket/all-ticket.component';
import { CalendarComponent } from 'src/app/components/calendar/calendar.component';
import { PaymentMethodComponent } from '../../components/payment-method/payment-method.component';
import { addIcons } from 'ionicons';
import { documentTextOutline, ellipsisVerticalOutline, helpCircleOutline, logOutOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonList,
    IonButton,
    IonItem,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonSegment,
    IonLabel,
    IonSegmentButton,
    IonContent,
    IonInput,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    OrderComponent,
    EventComponent,
    CalendarComponent,
    AllTicketComponent,
    PaymentMethodComponent,
    IonIcon,
    IonPopover,
    RouterLink
  ],
})
export class UserPage implements OnInit {
  modifyPage: boolean = false;
  user: any = null;

  // variabili per modifica password e email
  pass: string = '';
  newPass: string = '';
  newPassConf: string = '';
  newMail: string = '';
  newMailConf: string = '';
  errorPass: boolean = false;
  apprPass: boolean = false;
  errorMail: boolean = false;
  apprMail: boolean = false;

  // variabili per aggiunta/ modifica metodo pagamento
  existPaymentMeth: boolean = false;
  viewPaymMeth: boolean = true;
  defaultPayMeth: number | null = null;
  cardNumber: number | null = null;
  expirationDate: number | null = null;
  cvc: number | null = null;
  isDefault: number = 0;
  type: string = '';
  cardHolderName: string = '';
  errPD: boolean = false;
  payMeths: any[] = [];
  defCardNumber: string = '';
  defExpiredDate: string = '';
  defHolderName: string = '';
  indexDefPM: number = 0;
  pmIdDefPM: number = 0;

  // Variabili di cambio schermata
  visEvent: boolean = true;
  visOrder: boolean = false;
  visCalendar: boolean = false;
  visTicket: boolean = false;
  isMobile: boolean = false;

  private subs: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private platform: Platform
  ) {
    // Controlliamo se siamo su mobile
    this.isMobile =
      this.platform.is('mobile') ||
      this.platform.is('mobileweb') ||
      this.platform.is('android') ||
      this.platform.is('ios');

      addIcons({logOutOutline, ellipsisVerticalOutline, helpCircleOutline, shieldCheckmarkOutline, documentTextOutline})
  }

  firstName: string = '';
  lastName: string = '';
  userID: number | any;
  email: string = '';

  ngOnInit() {
    this.visCalendar = false;
    this.visOrder = false;
    // Salviamo tutti i dati dell'utente
    this.subs.add(
      this.userService.user.subscribe((user) => {
        if (user) {
          this.user = user;
          console.log('User infos:', this.user);
          this.firstName = this.user.firstName || '';
          this.lastName = this.user.lastName || '';
          this.userID = this.user.id || null;
          this.email = this.user.email;

          // Per ripristinare i messaggi di errore
          this.errorPass = false;
          this.apprPass = false;
          this.errorMail = false;
          this.apprMail = false;

          // far partire la funzione per prendere il metodo di pagamento di default e passarlo in defaultpayment
          this.cardNumber = null;
          this.expirationDate = null;
          this.cvc = null;
          this.isDefault = 0;
          this.type = '';
          this.cardHolderName = '';
          this.errPD = false;
        }
      })
    );

    this.userService.obtainPaymentMethod();

    // Prendiamo tutti i favorites dal Service e li salviamo nell'array
    this.subs.add(
      this.userService.paymentMethod.subscribe((payMeths) => {
        this.payMeths = [...payMeths];
        this.existPaymentMeth = this.payMeths.length > 0;
        if (this.existPaymentMeth) {
          this.infoDefPM();
          this.showDefPay();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  async logout() {
    try {
      await this.auth.logout();
      console.log('Logout effettuato con successo');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  }

  modifyEmail() {
    if (!this.newMail || !this.newMailConf) {
      this.errorMail = true;
      console.log('Tutti i campi sono obbligatori');
      return;
    }

    if (this.newMail !== this.newMailConf) {
      this.newMail = '';
      this.newMailConf = '';
      this.errorMail = true;
      return;
    }

    this.userService.modifyMail(this.newMailConf);
    this.email = this.newMailConf;
    this.errorMail = false;
    this.apprMail = true;
    this.newMail = '';
    this.newMailConf = '';
  }

  modifyPassword() {
    if (!this.pass || !this.newPass || !this.newPassConf) {
      this.errorPass = true;
      console.log('Tutti i campi sono obbligatori');
      return;
    }

    if (this.newPass !== this.newPassConf) {
      this.pass = '';
      this.newPass = '';
      this.newPassConf = '';
      this.errorPass = true;
      return;
    }

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/;
    if (this.newPass.length < 6 || !regex.test(this.newPass)) {
      this.errorPass = true;
      console.log('La password non rispetta i requisiti di sicurezza');
      return;
    }

    this.userService.modifyPassword(this.pass, this.newPass);
    this.errorPass = false;
    this.apprPass = true;
    this.pass = '';
    this.newPass = '';
    this.newPassConf = '';
  }

  modifyProfile() {
    this.modifyPage = !this.modifyPage;
    this.pass = '';
    this.newPass = '';
    this.newPassConf = '';
    this.errorPass = false;
    this.apprPass = false;
    this.errorMail = false;
    this.apprMail = false;
    this.newMail = '';
    this.newMailConf = '';
    this.viewPaymMeth = true;
  }

  confirmModifyProfile() {
    this.modifyPage = false;
    this.errorPass = false;
    this.apprPass = false;
    this.errPD = false;
    this.viewPaymMeth = true;
    this.userService.obtainPaymentMethod();
  }

  bloccaCaratteri(event: KeyboardEvent) {
    // È una funzione usata per far inserire solo determinati caratteri ovvero vogliamo mettere numeri in quanto nella data di scadenza,
    // nel numero della carta e nel CVC ci vanno solo numeri
    const allowed = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
    ];
    if (!allowed.includes(event.key)) {
      event.preventDefault();
    }
  }

  addPaymentMethod() {
    // Se è il primo metodo di pagamento viene impostato in automatico come predefinito
    if (this.payMeths.length === 0) {
      // Lo usiamo per definire che è il metodo predefinito
      this.isDefault = 1;
    } else {
      // Lo usiamo per definire che è un metodo secondario
      this.isDefault = 2;
    }

    // Verifica che tutti i campi siano compilati
    if (
      !this.cardNumber ||
      !this.expirationDate ||
      !this.cvc ||
      !this.type ||
      !this.cardHolderName
    ) {
      console.error('Tutti i campi sono obbligatori');
      return;
    }

    // Impostiamo i vari valori e aggiungiamo il metodo di pagamento al DB
    this.userService.addPaymentMethod(
      this.cardNumber.toString(),
      this.expirationDate.toString(),
      this.cvc.toString(),
      this.isDefault,
      this.type,
      this.cardHolderName
    );
    this.cardNumber = null;
    this.expirationDate = null;
    this.cvc = null;
    // Mostriamo il predefinito solo se isDefault=1
    if (this.isDefault === 1) {
      this.showDefPay();
    }
    this.isDefault = 0;
    this.type = '';
    this.cardHolderName = '';
    this.errPD = false;
    this.existPaymentMeth = true;
  }

  showDefPay() {
    const currentDefPM = this.payMeths.find((m) => m.isDefault === 1);
    if (currentDefPM) {
      this.defCardNumber = currentDefPM.cardNumber;
      this.defExpiredDate = currentDefPM.expirationDate;
      this.defHolderName = currentDefPM.cardHolderName;
      this.existPaymentMeth = true;
    } else {
      this.defCardNumber = '';
      this.defExpiredDate = '';
      this.defHolderName = '';
      this.existPaymentMeth = this.payMeths.length > 0;
    }
  }

  infoDefPM() {
    let currentDefPM = this.payMeths.find((m) => m.isDefault === 1);
    if (currentDefPM) {
      this.defCardNumber = currentDefPM.cardNumber;
      this.defExpiredDate = currentDefPM.expirationDate;
      this.defHolderName = currentDefPM.cardHolderName;
      this.pmIdDefPM = currentDefPM.pmID;
      this.existPaymentMeth = true;
      this.indexDefPM = this.payMeths.findIndex((m) => m.isDefault === 1);
    } else {
      this.pmIdDefPM = 0;
      this.indexDefPM = -1;
      this.existPaymentMeth = this.payMeths.length > 0;
    }
  }

  changeVisDPM() {
    this.viewPaymMeth = false;
  }

  deletePM(pmIdDel: number) {
    this.userService.deletePM(pmIdDel);
    this.userService.obtainPaymentMethod();
    this.showDefPay();
    this.infoDefPM();
    console.log();
  }

  setDefaultPM(pmChangeID: number) {
    this.userService.setDefaultPM(pmChangeID);
    this.userService.obtainPaymentMethod();
    this.showDefPay();
    this.infoDefPM();
  }

  delProfile() {
    this.userService.delProfile();
    this.auth.logout();
  }

  visualizeOrder() {
    this.visCalendar = false;
    this.visEvent = false;
    this.visOrder = true;
    this.visTicket = false;
  }

  visualizeDate() {
    this.visCalendar = true;
    this.visEvent = false;
    this.visOrder = false;
    this.visTicket = false;
  }

  visualizeEvent() {
    this.visCalendar = false;
    this.visEvent = true;
    this.visOrder = false;
    this.visTicket = false;
  }

  visualizeTicket() {
    this.visCalendar = false;
    this.visEvent = false;
    this.visOrder = false;
    this.visTicket = true;
  }
}
