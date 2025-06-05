import { Component, inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-riepilogo',
  templateUrl: './riepilogo.component.html',
  styleUrls: ['./riepilogo.component.scss'],
  imports: [CommonModule, CurrencyPipe, IonButton],
})
export class RiepilogoComponent  implements OnInit {

  cart: any[] = [];
  private cartSub!: Subscription;
  router = inject(Router);



  

  @Input() isDisabled: boolean = true;
  @Input() isCheckout: boolean = false;
  @Output() formTicketSelected = new EventEmitter<number>();
  @Output() isButtonClicked = new EventEmitter<boolean>();

  constructor(private cartService: CartService) { }



  ngOnInit() {

    this.cartSub = this.cartService.cart.subscribe(cart => {
      this.cart = cart;
    });

  }



  getTotalAmount(): number {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  checkout() {
    console.log('Navigating to checkout');
    this.router.navigate(['/checkout']);
  }

  showFormTicket(index: number) {

    this.formTicketSelected.emit(index); // emetti l'indice verso il padre
  }

  ngOnDestroy() {
    this.cartSub.unsubscribe();
  }


}


