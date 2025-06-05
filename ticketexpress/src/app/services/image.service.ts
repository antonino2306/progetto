import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseUrl = 'http://localhost:3000/images';
  // private baseUrl = 'http://147.163.216.19:3000/images';
  // private baseUrl = 'http://192.168.1.9:3000/images'; // Per testing su rete

  constructor() {}

  getEventImageUrl(filename: string | null | undefined): string {
    if (!filename || filename.trim() === '') {
      return this.getDefaultEventImage();
    }
    console.log(`Fetching event image from: ${this.baseUrl}/events/${filename}`);
    return `${this.baseUrl}/events/${filename}`;
  }

  getEventBackgroundImage(filename: string) {
    return `${this.baseUrl}/events/${filename}`
  }

  getArtistImageUrl(filename: string | null | undefined): string {
    if (!filename || filename.trim() === '') {
      return this.getDefaultArtistImage();
    }
    return `${this.baseUrl}/artists/${filename}`;
  }

  getCategoryImageUrl(filename: string | null | undefined): string {
    if (!filename || filename.trim() === '') {
      return this.getDefaultEventImage();
    }
    return `${this.baseUrl}/categories/${filename}`;
  }

  getDefaultEventImage(): string {
    return '../../../assets/images/default-event.png';
  }

  getDefaultArtistImage(): string {
    return '../../../assets/images/default-artist.png';
  }
}
