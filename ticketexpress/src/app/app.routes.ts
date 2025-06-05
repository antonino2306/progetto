import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Platform } from '@ionic/angular/standalone';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: (() => {
      const platform = inject(Platform);
      return platform.is('desktop') ? '' : 'tabs';
    }),
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./mobile/tabs/tabs.routes').then(m => m.routes)
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/cart/cart.page').then( m => m.CartPage)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.page').then(m => m.CheckoutPage)  
  },
  {
    path: 'category/:category',
    loadComponent: () => import('./pages/category/category.page').then( m => m.CategoryPage)
  },
  {
    path: 'event/:id',
    loadComponent: () => import('./pages/event/event.page').then( m => m.EventPage),
  },
  {
    path: 'search-results',
    loadComponent: () => import('./pages/search-results/search-results.page').then( m => m.SearchResultsPage)
  },
  {
    path: 'user',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/user/user.page').then( m => m.UserPage)
  },
  {
    path: 'password-recovery',
    loadComponent: () => import('./pages/recovery/password-recovery/password-recovery.page').then(m => m.PasswordRecoveryPage)
  },
  {
    path: 'password-modify',
    loadComponent: () => import('./pages/recovery/password-modify/password-modify.page').then( m => m.PasswordModifyPage)
  },
  {
    path: 'popular-events',
    loadComponent: () => import('./pages/popular-events/popular-events.page').then( m => m.PopularEventsPage)
  },
  {
    path: 'upcoming-events',
    loadComponent: () => import('./pages/upcoming-events/upcoming-events.page').then( m => m.UpcomingEventsPage)
  },
  {
    path: 'not-found',
    loadComponent: () => import('./pages/not-found/not-found.page').then( m => m.NotFoundPage)
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.page').then( m => m.FAQPage)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy.page').then( m => m.PrivacyPage)
  },
  {
    path: 'termini',
    loadComponent: () => import('./pages/termini/termini.page').then( m => m.TerminiPage)
  },
  {//questa sempre per ultima
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.page').then( m => m.NotFoundPage)
  },
  
  
  

];
