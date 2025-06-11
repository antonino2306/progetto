import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Category } from './event.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3000/profile';
  // private baseUrl: string = 'http://192.168.1.9:3000/profile'; // URL del backend per gli eventi

  private baseUrlTicket = 'http://localhost:3000/ticket';
  // private baseUrlTicket: string = 'http://192.168.1.9:3000/ticket'; // URL del backend per gli eventi

  user: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  favorites: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  orders: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  tickets: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  paymentMethod: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  reviews: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private errorService: ErrorService
  ) {
    this.auth.user.subscribe((authUser) => {
      if (authUser) {
        this.user.next(authUser);
        this.fetchFavorites();
        this.getReviews();
      }
    });
  }

  fetchFavorites() {
    this.http
      .get<any>(`${this.baseUrl}/favorites`, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          if (response.success && response.favoriteShows) {
            this.favorites.next(response.favoriteShows);
            console.log('Favorites:', response.favoriteEvents);
          } else {
            console.error('Error on gaining favorites:', response);
          }
        },
      });
  }

  fetchOrders() {
    this.http
      .get<any>(`${this.baseUrl}/orders`, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          if (response.success && response.orders) {
            this.orders.next(response.orders);
            console.log('Orders:', response.orders);
          } else {
            console.error('Error on fetching orders:', response);
          }
        },
      });
  }

  fetchTickets() {
    this.http
      .get<any>(`${this.baseUrl}/tickets`, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          if (response.success && response.tickets) {
            this.tickets.next(response.tickets);
            console.log('Tickets:', response.tickets);
          } else {
            console.error('Error on gaining tickets', response);
          }
        },
      });
  }

  modifyPassword(password: string, newPassword: string) {
    this.http
      .post<any>(
        `${this.baseUrl}/update-passwd`,
        { password, newPassword },
        { withCredentials: true }
      )
      .subscribe({
        next: async (response: any) => {
          if (response.success) {
            console.log('Password modified successfully!');
            try {
            } catch (error) {
              console.error('Error on fetching User:', error);
            }
          } else {
            console.error('Error on modifying password:', response.message);
          }
        },
        error: (error) => {
          console.error('Error on modifying password:', error);
        },
      });
  }

  modifyMail(newMail: string) {
    this.http
      .post<any>(
        `${this.baseUrl}/update-mail`,
        { newMail },
        { withCredentials: true }
      )
      .subscribe({
        next: async (response: any) => {
          if (response.success) {
            console.log('Email modified successfully!');
            try {
              await this.auth.getUserInfo();
            } catch (error) {
              console.error('Error on fetching User:', error);
            }
          } else {
            console.error('Error on modifying email:', response.message);
          }
        },
        error: (error) => {
          console.error('Error on modifying email:', error);
        },
      });
  }

  addPaymentMethod(
    cardNumber: string,
    expirationDate: string,
    cvc: string,
    isDefault: number,
    type: string,
    cardHolderName: string
  ) {
    this.http
      .post<any>(
        `${this.baseUrl}/payment`,
        { type, cardNumber, expirationDate, cvc, cardHolderName, isDefault },
        { withCredentials: true }
      )
      .subscribe({
        next: async (response: any) => {
          if (response.success) {
            console.log('Payment method added successfully!');
            this.obtainPaymentMethod();
            try {
            } catch (error) {
              console.error('Error on fetching User:', error);
            }
          } else {
            console.error('Error on adding payment method:', response.message);
          }
        },
        error: (error) => {
          console.error('Error on adding payment method:', error);
        },
      });
  }

  obtainPaymentMethod() {
    this.http
      .get<any>(`${this.baseUrl}/payment-obtain`, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          if (response.success && response.paymentMethods) {
            console.log('Payment Methods:', response.paymentMethods);
            this.paymentMethod.next(response.paymentMethods);
          } else {
            console.error('Error on gaining payment methods:', response);
          }
        },
        error: (error) => {
          console.error(
            'Errore nella chiamata API dei metodi di pagamento:',
            error
          );
        },
      });
  }

  deletePM(pmID: number) {
    const userId = this.auth.user.getValue()?.id;
    if (!userId) {
      console.error('User not authenticated');
      this.router.navigate(['/login']);
      return;
    }

    this.http
      .put<any>(
        `${this.baseUrl}/payment-obtain/${pmID}/delete`,
        {},
        { withCredentials: true }
      )
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            console.log('Payment method deleted successfully!');
            this.obtainPaymentMethod();
          } else {
            console.error(
              'Error on deleting payment method:',
              response.message
            );
          }
        },
        error: (error) => {
          console.error('Error on deleting payment method:', error);
        },
      });
  }

  setDefaultPM(pmID: number) {
    this.http
      .put<any>(
        `${this.baseUrl}/payment-obtain/${pmID}/update`,
        {},
        { withCredentials: true }
      )
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            console.log('Payment method deleted successfully!');
            this.obtainPaymentMethod();
          } else {
            console.error(
              'Error on deleting payment method:',
              response.message
            );
          }
        },
        error: (error) => {
          console.error('Error on deleting payment method:', error);
        },
      });
  }

  delProfile() {
    this.http
      .post<any>(
        `${this.baseUrl}/delete-account`,
        {},
        { withCredentials: true }
      )
      .subscribe({
        next: async (response: any) => {
          if (response.success) {
            console.log('Account deleted successfully!');
          } else {
            console.error('Error on deleting account:', response.message);
          }
        },
        error: (error) => {
          console.error('Error on deleting account:', error);
        },
      });
  }

  changeTicketHolderName(
    ticketID: number,
    holderName: string,
    holderSurname: string
  ) {
    this.http
      .put<any>(
        `${this.baseUrlTicket}/change-holder-name`,
        { ticketID, holderName, holderSurname },
        { withCredentials: true }
      )
      .subscribe({
        next: async (response: any) => {
          if (response.success) {
            console.log('Ticket holder changed successfully!');
            const currentTickets = this.tickets.getValue();
            const updatedTickets = currentTickets.map((ticket) => {
              if (ticket.ticketID === ticketID) {
                return { ...ticket, holderName, holderSurname };
              }
              return ticket;
            });
            this.tickets.next(updatedTickets);
          } else {
            this.errorService.handleHttpError(response);
          }
        },
        error: (error) => {
          this.errorService.handleHttpError(error);
        },
      });
  }

  changeTicketStatus(ticketID: number) {
    this.http
      .put<any>(
        `${this.baseUrlTicket}/change-ticket-status`,
        { ticketID },
        { withCredentials: true }
      )
      .subscribe({
        next: async (response: any) => {
          if (response.success) {
            console.log('Ticket status changed successfully!');
          } else {
            this.errorService.handleHttpError(response);
          }
        },
        error: (error) => {
          this.errorService.handleHttpError(error);
        },
      });
  }

  newReview(showID: number, rate: number, description: string) {
    this.http
      .post<any>(
        `${this.baseUrl}/new-review`,
        { showID, rate, description },
        { withCredentials: true }
      )
      .subscribe({
        next: async (response: any) => {
          if (response.success) {
            console.log('Review add successfully!');
            this.getReviews();
          } else {
            console.error('Error on adding review:', response.message);
          }
        },
        error: (error) => {
          console.error('Error on adding review:', error);
        },
      });
  }

  getReviews() {
    this.http
      .get<any>(`${this.baseUrl}/get-review`, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            console.log('Review got successfully!');
            console.log('Reviews:', response.reviews);
            this.reviews.next(response.reviews);
          } else {
            console.error('Error on getting review:', response.message);
          }
        },
        error: (error) => {
          console.error('Error on getting review:', error);
        },
      });
  }

  addFavoriteCategory(categoryID: number): Promise<any> {
    return firstValueFrom(
      this.http.post<any>(
        `${this.baseUrl}/favorite-categories/add`,
        { categoryID },
        { withCredentials: true }
      )
    )
      .then((response: any) => {
        if (response.success) {
          return response;
        } else {
          throw new Error('Error on adding favorite category');
        }
      })
      .catch((error) => {
        console.error('Error on adding favorite category:', error);
        throw error;
      });
  }

  fetchFavoriteCategories(): Promise<Category[]> {
    const auth = this.auth.user.getValue();
    if (!auth) {
      return Promise.resolve([]);
    }

    return firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/favorite-categories`, {
        withCredentials: true,
      })
    )
      .then((response: any) => {
        if (response.success) {
          return response.categories;
        } else {
          throw new Error('Error on fetching favorite categories');
        }
      })
      .catch((error) => {
        console.error('Error on fetching favorite categories:', error);
        throw error;
      });
  }
}
