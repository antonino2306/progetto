import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  
  return authService.isLoggedIn$.pipe(
    take(1), // Prende solo il primo valore emesso dall'Observable
    map((isLoggedIn) => {
      console.log('Stato autenticazione:', isLoggedIn); // Log dello stato di autenticazione
      if (isLoggedIn) {
        // L'utente è autenticato, consenti l'accesso
        return true;
      } else {
        // L'utente non è autenticato, reindirizza alla pagina di login
        router.navigate(['/login']);
        return false;
      }
    })
  );

};
