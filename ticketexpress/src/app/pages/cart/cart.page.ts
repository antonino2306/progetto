import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CartService } from 'src/app/services/cart.service';
import { interval, Subscription } from 'rxjs';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Router } from '@angular/router';
import { RiepilogoComponent } from 'src/app/components/riepilogo/riepilogo.component';
import { addIcons } from 'ionicons';
import { addOutline, removeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
    IonIcon,
    IonButton,
    RiepilogoComponent,
  ],
})
export class CartPage implements OnInit, OnDestroy {
  cart: any[] = [];
  router = inject(Router);

  timerDisplay: string = '';
  private cartSub!: Subscription;
  private timerSub!: Subscription;

  constructor(private cartService: CartService) {
    addIcons({ addOutline, removeOutline });
  }

  ngOnInit() {
    this.cartSub = this.cartService.cart.subscribe((cart) => {
      this.cart = cart;
      this.updateTimer();
      this.timerSub = interval(1000).subscribe(() => this.updateTimer());
    });
  }

  ngOnDestroy() {
    this.cartSub.unsubscribe();
    if (this.timerSub) this.timerSub.unsubscribe();
  }

  updateTimer() {
    const ms = this.cartService.getCartTimerRemaining();
    if (ms !== null && ms > 0) {
      const min = Math.floor(ms / 60000);
      const sec = Math.floor((ms % 60000) / 1000);
      this.timerDisplay = `${min}:${sec.toString().padStart(2, '0')}`;
    } else {
      this.timerDisplay = '00:00';
    }
  }

  async increaseQuantity(item: any) {
    try {
      await this.cartService.add(item.id);
    } catch (error) {
      console.error('Errore aggiornando la quantità:', error);
    }
  }

  async decreaseQuantity(item: any) {
    try {
      await this.cartService.remove(item.id, this.cart.length === 1 && this.cart[0].quantity === 1 ? true : false);
    } catch (error) {
      console.error('Errore aggiornando la quantità:', error);
    }

  }

  checkout() {
    console.log('Navigating to checkout');
    this.router.navigate(['/checkout']);
  }

}
