import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  card,
  location,
  logoFacebook,
  logoInstagram,
  logoLinkedin,
  logoPaypal,
  logoTwitter,
  mail,
  ticket,
  wallet,
} from 'ionicons/icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [CommonModule, IonButton, IonIcon, RouterLink],
})
export class FooterComponent {

  currentYear = new Date().getFullYear();
  isMobile: boolean = false;

  socialLinks = [
    { name: 'Facebook', icon: 'logo-facebook', url: '#' },
    { name: 'Instagram', icon: 'logo-instagram', url: '#' },
    { name: 'Twitter', icon: 'logo-twitter', url: '#' },
    { name: 'LinkedIn', icon: 'logo-linkedin', url: '#' },
  ];

  quickLinks = [
    { title: 'Eventi', route: '/' },
    { title: 'Biglietti', route: '/user' },
    { title: 'FAQ', route: '/faq' },
    { title: 'Contatti', route: '/contatti' },
  ];

  supportLinks = [
    { title: 'Centro Assistenza', route: '/assistenza' },
    { title: 'Termini e Condizioni', route: '/termini' },
    { title: 'Privacy Policy', route: '/privacy' },
    { title: 'Rimborsi', route: '/rimborsi' },
  ];
  constructor(private platform: Platform) {
    addIcons({
      logoFacebook,
      logoInstagram,
      logoTwitter,
      logoLinkedin,
      mail,
      location,
      ticket,
      logoPaypal,
      card,
      wallet
    });

    this.isMobile =
      this.platform.is('mobile') ||
      this.platform.is('mobileweb') ||
      this.platform.is('capacitor') ||
      this.platform.is('android');
  }

  openSocialLink(url: string) {
    window.open(url, '_blank');
  }
}
