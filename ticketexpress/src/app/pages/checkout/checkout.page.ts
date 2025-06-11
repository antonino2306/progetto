import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgTemplateOutlet } from '@angular/common';
import { FormGroup, FormsModule, Validators, FormBuilder, FormArray } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonItem,
  IonInput,
  AlertController,
  Platform
} from '@ionic/angular/standalone';
import { HeaderComponent } from "../../components/header/header.component";
import { CartService } from 'src/app/services/cart.service';
import { Subscription } from 'rxjs';
import { PaymentMethodComponent } from '../../components/payment-method/payment-method.component';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';
import { RiepilogoComponent } from 'src/app/components/riepilogo/riepilogo.component';
import { ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    NgFor,
    IonContent,
    IonButton,
    IonItem,
    IonInput,
    HeaderComponent,
    PaymentMethodComponent,
    RiepilogoComponent,
    ReactiveFormsModule
  ]
})
export class CheckoutPage implements OnInit, OnDestroy {

  isMobile: boolean = false;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private platform: Platform,
  ) {
    this.isMobile =
      this.platform.is('mobile') ||
      this.platform.is('mobileweb') ||
      this.platform.is('capacitor') ||
      this.platform.is('android');
  }
  

  private paymentMethodSub: Subscription = new Subscription();

  cartSub!: Subscription;
  router = inject(Router);
  hasPaid: boolean = false;
  cart: any[] = []
  pmID: number = -1;

  whichFormTicket: number = 0;
  ticketform!: FormGroup;
  ticketNames: {
    [cartIndex: number]: { firstName: string, lastName: string }[]
  } = {};

  ngOnInit() {
    this.cartSub = this.cartService.cart.subscribe(cart => {
      this.cart = cart;
      if(this.cart.length === 0) 
        this.goHome();
      
      console.log("Cart items:", this.cart);
      this.initTicketForm();
    });
  }

  IonViewWillEnter() {
    this.tickets.clear();
  }

  initTicketForm() {
    const quantity = this.cart[this.whichFormTicket]?.quantity || 1;
    const savedTickets = this.ticketNames[this.whichFormTicket] || [];
    this.ticketform = this.fb.group({
      tickets: this.fb.array(
        Array.from({ length: quantity }, (_, i) =>
          this.fb.group({
            firstName: [savedTickets[i]?.firstName || '', Validators.required],
            lastName: [savedTickets[i]?.lastName || '', Validators.required]
          })
        )
      )
    });
  }

  get tickets(): FormArray {
    return this.ticketform.get('tickets') as FormArray;
  }

  ngOnDestroy() {
    this.cartSub.unsubscribe();
    this.paymentMethodSub.unsubscribe();
  }

  getTotalAmount(): number {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  //set degli alert
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  paymentMethodValidator(): boolean {
    if (this.pmID === -1) {
      this.presentAlert('Attenzione', 'Seleziona un metodo di pagamento');
      return false;
    }
    return true;
  }

  //aggiornare whichFormTicket e cambiare la visualizzazione
  onFormTicketSelected(index: number) {
    this.whichFormTicket = index;
    this.initTicketForm();  
  }

  isDisabled(): boolean {
    const allFormsCompleted = Object.keys(this.ticketNames).length === this.cart.length;

    return !allFormsCompleted
  }

  //salva i ticket di un evento
  async onSubmit() {

    // Salva i dati dei biglietti per l'elemento selezionato del carrello
    this.ticketNames[this.whichFormTicket] = this.tickets.controls.map(group => ({
      firstName: group.get('firstName')?.value,
      lastName: group.get('lastName')?.value
    }));
    await this.presentAlert('Salvataggio', 'Dati dei biglietti salvati con successo');

    
    if (this.whichFormTicket < this.cart.length - 1) {
      this.onFormTicketSelected(this.whichFormTicket + 1);
    } else {
      this.onFormTicketSelected(0);
    }
  }

  //procede al pagamento
  async pay(isButtonClicked: boolean) {

    if( !this.paymentMethodValidator())
      return;

    const shows = this.cart.map((item, cartIndex) => {
      return {
        showID: item.id, // o showID, a seconda di come si chiama la proprietà
        tickets: this.ticketNames[cartIndex] // array di { firstName, lastName }
      };
    });
    console.log(shows);

    const total = this.getTotalAmount();

    try {
      this.paymentService.pay(this.pmID, total, shows);
      this.paymentService.sendEmail();

      await this.presentAlert('Successo', 'Pagamento effettuato con successo');

      this.router.navigate(['/']);

    } catch (e) {
      console.error("Error on payment", e);
      await this.presentAlert('Errore', 'Si è verificato un errore durante il pagamento');
    }
  }

  async goHome(){
    this.router.navigate(['/']);

  }
}