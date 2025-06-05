import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from './error.service'; // aggiungi questo import

@Injectable({
  providedIn: 'root'
})
export class RecoveryService {
  private baseUrl = 'http://localhost:3000/recovery'; // Cambia porta se necessario

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  isEmailValid(email: string): Promise<any> {
    return firstValueFrom(
      this.http.post(
        `${this.baseUrl}/verify-email`,
        { email }
      )
    )
      .then((response: any) => {
        if (response.success) {
          return response; // Restituisci la risposta se l'email esiste
        } else {
          this.errorService.handleHttpError(response); // aggiunto
          throw new Error(response.message || 'Controllo email non riuscito');
        }
      })
      .catch((err) => {
        this.errorService.handleHttpError(err); // aggiunto
        console.error('Error during email existence check:', err);
        throw new Error(err.error?.message || 'Errore durante il controllo email');
      });
  }

  forgotPassword(email: string): Promise<any> {
    return firstValueFrom(
      this.http.post(
        `${this.baseUrl}/forgot-password`,
        { email }
      )
    )
    .then((response: any) => {
      if (response.success) {
        return response;
      } else {
        this.errorService.handleHttpError(response); // aggiunto
        throw new Error(response.message || 'Errore durante la richiesta di reset password');
      }
    })
    .catch((err) => {
      this.errorService.handleHttpError(err); // aggiunto
      console.error('Error during forgot password:', err);
      throw new Error(err.error?.message || 'Errore durante la richiesta di reset password');
    });
  }

  resetPassword(token: string, newPassword: string): Promise<any> {
    return firstValueFrom(
      this.http.post(
        `${this.baseUrl}/reset-password`,
        { token, newPassword }
      )
    )
    .then((response: any) => {
      if (response.success) {
        return response;
      } else {
        this.errorService.handleHttpError(response); // aggiunto
        throw new Error(response.message || 'Errore durante il reset della password');
      }
    })
    .catch((err) => {
      this.errorService.handleHttpError(err); // aggiunto
      console.error('Error during password reset:', err);
      throw new Error(err.error?.message || 'Errore durante il reset della password');
    });
  }
}
