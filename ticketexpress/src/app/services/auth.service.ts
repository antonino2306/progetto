import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  firstValueFrom,
} from 'rxjs';
import { ErrorService } from './error.service'; // aggiungi questo import

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private baseUrl = 'http://192.168.1.9:3000/auth'; // URL del backend per l'autenticazione
  private baseUrl = 'http://localhost:3000/auth'; // URL del backend per l'autenticazione
  // private baseUrl = 'http://147.163.216.154:3000/auth'; // URL del backend per il carrello

  router: Router = inject(Router);

  isLoggedIn = new ReplaySubject<boolean>(1);
  user = new BehaviorSubject<User | null>(null);
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  isAuthenticated(): Promise<any> {
    return firstValueFrom(
      this.http.get(`${this.baseUrl}/is-authenticated`, {
        withCredentials: true,
      })
    )
      .then((response: any) => {
        console.log('Response:', response.success);
        this.isLoggedIn.next(response.success);
        this.user.next(response.user);
        console.log('Login status:', response);
      })
      .catch((err) => {
        this.errorService.handleHttpError(err); // aggiunto
        console.error('Error during authentication check:', err);
        this.isLoggedIn.next(false);
      });
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }

  get user$(): Observable<User | null> {
    return this.user.asObservable();
  }

  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
    rememberMe: boolean
  ): Promise<any> {
    return firstValueFrom(
      this.http.post(
        `${this.baseUrl}/register`,
        { firstName, lastName, email, password, confirmPassword, rememberMe },
        { withCredentials: true }
      )
    )
      .then((response: any) => {
        if (response.success) {
          this.isLoggedIn.next(true);
          this.user.next(response.user);
          return response;
        } else {
          this.errorService.handleHttpError(response); // aggiunto
          throw new Error(response.message || 'Registrazione non riuscita');
        }
      })
      .catch((err) => {
        this.errorService.handleHttpError(err); // aggiunto
        throw new Error(err.error.message || 'Errore durante la registrazione');
      });
  }

  login(email: string, password: string): Promise<any> {
    return firstValueFrom(
      this.http.post(`${this.baseUrl}/`, { email, password }, { withCredentials: true })
    ).then((response: any) => {
      if (response.success) {
        this.isLoggedIn.next(true);
        this.user.next(response.user);
        this.router.navigate(['']);
        return response; 
      } else {
        this.errorService.handleHttpError(response); // aggiunto
        throw new Error(response.message || 'Login non riuscito');
      }
    }).catch((err) => {
      this.errorService.handleHttpError(err); // aggiunto
      throw new Error(err.error.message || 'Errore durante il ');
    });
  }

  logout(): Promise<any> {
    return firstValueFrom(
      this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true })
    )
      .then((response: any) => {
        if (response.success) {
          this.isLoggedIn.next(false);
          this.user.next(null);
          this.router.navigate(['']);
          return response; // Restituisci il risultato alla funzione chiamante
        } else {
          this.errorService.handleHttpError(response); // aggiunto
          throw new Error(response.message || 'Logout non riuscito');
        }
      })
      .catch((err) => {
        this.errorService.handleHttpError(err); // aggiunto
        throw new Error(err.error.message || 'Errore durante il logout');
      });
  }
}
