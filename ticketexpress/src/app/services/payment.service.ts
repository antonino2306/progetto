import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorService } from './error.service'; // aggiungi questo import

import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = 'http://localhost:3000/payment/'; 

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private errorService: ErrorService // aggiungi qui
  ) { }

  pay(pmID: number, total: number, shows: Object[]) {
    try {
      this.http.post(`${this.baseUrl}`, { pmID, total, shows }, { withCredentials: true })
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              console.log("Payment successful:", response);

              CartService.resetCartTimer();

              this.cartService.fetchCart();
              
            } else {
              console.error("Error on payment:", response);
              this.errorService.handleHttpError(response); // aggiunto
            }
          },
          error: (error: any) => {
            console.error("Error on payment:", error);
            alert("Error on payment");
            this.errorService.handleHttpError(error); // aggiunto
          }
        });
    } catch (e) {  
      console.error("Error on payment", e);
      this.errorService.handleHttpError(e); // aggiunto
    }
  }

  sendEmail() {
    try {
      this.http.post(`${this.baseUrl}payment-email-success`, {}, { withCredentials: true })
        .subscribe({
          next: (response: any) => {
            console.log("Email sent successfully", response);
          },
          error: (error: any) => {
            console.error("Error on send payment's email", error);
            this.errorService.handleHttpError(error); // aggiunto
          }
        });
    } catch (e) {
      console.error("Error on send payment's email", e);
      this.errorService.handleHttpError(e); // aggiunto
    }
  }
}
