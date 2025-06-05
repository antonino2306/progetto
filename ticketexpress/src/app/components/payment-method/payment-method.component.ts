import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonList,
  IonInput,
} from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    NgFor,
    IonButton,
    IonItem,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonList,
    IonInput,
  ]
})
export class PaymentMethodComponent  {
  
  constructor(private userService: UserService) {}

  
  private paymentMethodSubscription: Subscription = new Subscription();

  @Output() pmID = new EventEmitter<number>();
  @Input() isInRow: boolean = true; 

  pass = '';
  newPass = '';
  newPassConf = '';
  errorPass = false;
  apprPass = false;
  expirationDateError: string = '';


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
  
 
  ngOnInit() {
    this.cardNumber = null;
    this.expirationDate = null;
    this.cvc = null;
    this.isDefault = 0;
    this.type = '';
    this.cardHolderName = '';
    this.errPD = false;
    
    this.userService.obtainPaymentMethod();


    this.paymentMethodSubscription = this.userService.paymentMethod.subscribe(
      (payMeths) => {
        this.payMeths = [...payMeths];
        this.existPaymentMeth = this.payMeths.length > 0;
        if (this.existPaymentMeth) {
          this.infoDefPM();
          this.showDefPay();
        }
      }
    );

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
      this.pmID.emit(this.payMeths[this.indexDefPM].pmID);
    } else {
      this.pmIdDefPM = 0;
      this.indexDefPM = -1;
      this.existPaymentMeth = this.payMeths.length > 0;
      this.pmID.emit(-1);
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


  formatCardNumber(num: string | number | null): string {

    if (!num) return '';
    
    return num.toString().replace(/\D/g, '').replace(/(.{4})/g, '$1-').replace(/-$/, '');

  }

  onCardNumberInput(event: any) {

  let value = event.target.value.replace(/\D/g, '').slice(0, 16); 
  value = value.replace(/(.{4})/g, '$1-').replace(/-$/, '');
  this.cardNumber = value;

}
  
onExpirationDateInput(event: any) {
  this.expirationDateError = '';
  let value = event.target.value.replace(/\D/g, '').slice(0, 4);
  let month = value.slice(0, 2);
  let year = value.slice(2, 4);

  // Validazione mese
  let valid = true;
  if (month.length === 2) {

    let monthNum = parseInt(month, 10);

    if (monthNum < 1 || monthNum > 12) {
      valid = false;
      this.expirationDateError = 'Mese non valido';
    }
  }

  // Ricostruzione stringa
  if (value.length > 2) 

    value = month + '/' + year;

  else 

    value = month;
  

  this.expirationDate = value;
  }


  ngOnDestroy() {
    this.paymentMethodSubscription.unsubscribe();
  }
}
