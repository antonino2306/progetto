import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  Platform
} from '@ionic/angular/standalone';
import { CartService } from '../../services/cart.service';
import { interval, Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { cartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-cart-component',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonFab,
    IonFabButton,
    IonIcon,
    IonModal,
    IonContent,
    IonButton,
    IonItem,
    IonLabel,
  ]
})
export class CartComponent implements OnInit, OnDestroy {

  isModalOpen: boolean = false;
  isMobile: boolean = false;
  cart: any[] = [];
  timerDisplay: string = '';
  private timerSub!: Subscription;
  private cartSub!: Subscription;

  constructor(
    public cartService: CartService,
    private router: Router,
    private platform: Platform
  ) {
    addIcons({
      cartOutline
    })
  }

  ngOnInit() {
    
    this.isMobile =
      this.platform.is('mobile') ||
      this.platform.is('mobileweb') ||
      this.platform.is('capacitor') ||
      this.platform.is('android') ||
      window.innerWidth < 768;

    this.cartSub = this.cartService.cart.subscribe(cart => {
      this.cart = cart;
      this.updateTimer();
      this.timerSub = interval(1000).subscribe(() => this.updateTimer());
    });
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

  ngOnDestroy() {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
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
    if (item.quantity >= 1) {
      try {
        await this.cartService.remove(item.id,false);
      } catch (error) {
        console.error('Errore aggiornando la quantità:', error);
      }
    }
    if(item.quantity == 1 && this.cart.length == 1) {
      try {
        await this.cartService.remove(item.id,true);
      } catch (error) {
        console.error('Errore aggiornando la quantità:', error);
      }
    }

  }

  async checkout() {
    console.log('Navigating to checkout');
    this.isModalOpen = false;
    await new Promise(resolve => setTimeout(resolve, 400));
    this.router.navigate(['/checkout']);
  }

  closeModal() {
    this.isModalOpen = false;
    // Sposta il focus su un elemento visibile, ad esempio il body
    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
      document.body.focus();
    }, 100);
  }
}
