import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { ErrorService } from './error.service'; // aggiungi questo import

@Injectable({
  providedIn: 'root'
})
export class CartService {

  readonly CART_TIMEOUT_MS = 10 * 60 * 1000; // 10 minuti

  private baseUrl = 'http://localhost:3000/cart'; // URL del backend per il carrello
  // private baseUrl: string = 'http://192.168.1.9:3000/cart'; // URL del backend per gli eventi

  cart: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  private cartTimer: any | null = null; // Timer per il timeout del carrello
  private cartTimerExpiresAt: number | null = null;
  

  private _cartTimer: any | null = null;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private errorService: ErrorService 
  ) {

    this.auth.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.fetchCart();
      }
    })

    //Ripristinare il timer anche se l'utente ricarica la pagina
    const expiresAt = localStorage.getItem('cartTimerExpiresAt');
    if (expiresAt) {
      this.cartTimerExpiresAt = parseInt(expiresAt, 10);
      const remaining = this.cartTimerExpiresAt - Date.now();
      if (remaining > 0) {
        this.cartTimer = setTimeout(() => {

          this.unblockSeatAll();
          this.removeAll();
          this.cartTimerExpiresAt = null;
          localStorage.removeItem('cartTimerExpiresAt');
          
        }, remaining);
      } else {
        this.cartTimerExpiresAt = null;
        localStorage.removeItem('cartTimerExpiresAt');
      }
    }

  }

  add(showID: number, quantity: number = 1) {
    const userId = this.auth.user.getValue()?.id;
    if (!userId) {
      console.error('User not authenticated');
      this.router.navigate(['/login']);
      return;
    }

    this.http.get(`${this.baseUrl}/${showID}/available-tickets`, { withCredentials: true })
      .pipe(
        take(1)
      )
      .subscribe({
        next: (response: any) => {
          if (response.success && response.availableTickets >= quantity) {
            this.addToCart(showID, quantity);
          }
          else {
            console.error('Not enough tickets available:', response.availableTickets);
            this.errorService.handleHttpError(response); // aggiunto
            alert(`Not enough tickets available. Only ${response.availableTickets} left.`);
          }
        },
        error: (error: any) => {
          console.error('Error fetching available tickets:', error);
          this.errorService.handleHttpError(error); // aggiunto
        }
      })
  }

  private addToCart(showID: number, quantity: number) {
    this.http.post(`${this.baseUrl}/add`, { showID, quantity }, { withCredentials: true })
      .subscribe({
        next: async (response: any) => {
          if (response.success) {
            console.log('Show added to cart successfully');
            try {
              await this.fetchCart();
              console.log("New cart:", this.cart.getValue());

              //setto il timer solo dopo che l'observable ha emesso un nuovo valore
              this.setTimer(showID,quantity);

            } catch (error) {
              console.error('Error fetching cart after add:', error);
              this.errorService.handleHttpError(error); // aggiunto
            }
          } else {
            console.error('Error adding show to cart:', response.message);
            this.errorService.handleHttpError(response); // aggiunto
          }
        },
        error: (error) => {
          console.error('Error adding show to cart:', error);
          this.errorService.handleHttpError(error); // aggiunto
        }
      });
  }

  fetchCart() {
    return firstValueFrom(
      this.http.get<any[]>(`${this.baseUrl}`, { withCredentials: true })
    ).then((response: any) => {
      if (response.success) {
        this.cart.next(response.events);
        console.log('Cart fetched successfully:', response.events);

        return response.events;
      } else {
        this.errorService.handleHttpError(response); // aggiunto
        throw new Error(response.message || 'Error fetching cart');
      }
    }).catch((err) => {
      this.errorService.handleHttpError(err); // aggiunto
      throw new Error(err.error?.message || 'Error fetching cart');
    });
  }

  remove(showID: number,resetTimer: boolean  ,removeAll: boolean = false ) {
    const userId = this.auth.user.getValue()?.id;
    if (!userId) {
      console.error('User not authenticated');
      this.router.navigate(['/login']);
      return;
    }

    this.http.put(`${this.baseUrl}/delete`, { showID, removeAll }, { withCredentials: true })
      .subscribe({
        next: async (response: any) => {
          if (response.success) {
            console.log('Show removed from cart successfully');

            try {
              await this.fetchCart();
              console.log("New cart:", this.cart.getValue());

              this.unblockSeat(showID);

              if( resetTimer ) {
                //reset del timer
                this.cartTimer = null;
                this.cartTimerExpiresAt = null;
                localStorage.removeItem('cartTimerExpiresAt');
              }

             
            } catch (error) {
              console.error('Error fetching cart after removal:', error);
              this.errorService.handleHttpError(error); // aggiunto
            }
          } else {
            console.error('Error during removal', response.message);
            this.errorService.handleHttpError(response); // aggiunto
          }
        },
        error: (error) => {
          console.error('Error during removal:', error);
          this.errorService.handleHttpError(error); // aggiunto
        }
      });
  }

  removeAll() {
    this.http.put(`${this.baseUrl}/delete-all`, {}, { withCredentials: true })
      .subscribe({
        next: async (response: any) => {
          if (response.success) {
            console.log('All shows removed from cart successfully');
            try {
              await this.fetchCart();
              console.log("New cart:", this.cart.getValue());

               //reset del timer
              this.cartTimer = null;
              this.cartTimerExpiresAt = null;


            } catch (error) {
              console.error('Error fetching cart after removal:', error);
              this.errorService.handleHttpError(error); // aggiunto
            }
          } else {
            console.error('Error during removal', response.message);
            this.errorService.handleHttpError(response); // aggiunto
          }
        },
        error: (error) => {
          this.errorService.handleHttpError(error); // aggiunto
          console.error('Error during removal:', error);
        }
      });
  }

  private setTimer(showID: number, quantity: number) {
    
    this.blockSeat(showID, quantity);

    // Se il timer è già attivo, non lo riavviare
    if (this.cartTimer) {
      console.log('Cart timer already running, not resetting.');
      return;
    }

    // Salva il timestamp di scadenza
    this.cartTimerExpiresAt = Date.now() + this.CART_TIMEOUT_MS;
    localStorage.setItem('cartTimerExpiresAt', this.cartTimerExpiresAt.toString());

    this.cartTimer = setTimeout(() => {
      this.unblockSeatAll();
      this.removeAll();
      this.cartTimerExpiresAt = null;
      localStorage.removeItem('cartTimerExpiresAt');
      this.cartTimer = null;
    }, this.CART_TIMEOUT_MS);

    console.log('Cart timer started, will expire in 10 minutes');
  }

  //ritorna il tempo rimanente in millisecondi
  getCartTimerRemaining(): number | null {
    if (this.cartTimerExpiresAt) {
      return Math.max(0, this.cartTimerExpiresAt - Date.now());
    }
    return null;
  }

  private blockSeat(showID: number, quantity: number){

    this.http.post(`${this.baseUrl}/block-seat`, { showID, quantity }, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            console.log('Seat blocked successfully');
          } else {
            console.error('Error blocking seat:', response.message);
            this.errorService.handleHttpError(response); // aggiunto
          }
        },
        error: (error) => {
          this.errorService.handleHttpError(error); // aggiunto
          console.error('Error blocking seat:', error);
        }
      });

  }
  private unblockSeatAll(){

    this.http.post(`${this.baseUrl}/unblock-seat-all`, {} ,{ withCredentials: true })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            console.log('Seat unblocked successfully');
          } else {
            console.error('Error unblocking seat:', response.message);
            this.errorService.handleHttpError(response); // aggiunto
          }
        },
        error: (error) => {
          this.errorService.handleHttpError(error); // aggiunto
          console.error('Error unblocking seat:', error);
        }
      });

  }

  private unblockSeat(showID: number){
    this.http.post(`${this.baseUrl}/unblock-seat`, { showID }, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            console.log('Seat unblocked successfully');
          } else {
            console.error('Error unblocking seat:', response.message);
            this.errorService.handleHttpError(response); // aggiunto
          }
        },
        error: (error) => {
          this.errorService.handleHttpError(error); // aggiunto
          console.error('Error unblocking seat:', error);
        }
      });
  }

  set cartExpiresAt(value: number | null) {
    this.cartTimerExpiresAt = value;
    if (value) {
      localStorage.setItem('cartTimerExpiresAt', value.toString());
    } else {
      localStorage.removeItem('cartTimerExpiresAt');
    }
  }

   static resetCartTimer() {

    const expiresAt = localStorage.getItem('cartTimerExpiresAt');
    if (expiresAt) {
      localStorage.removeItem('cartTimerExpiresAt');
      console.log('Cart timer reset');
    }
  }
  
}
