import { Component, OnInit, Input } from '@angular/core';
import { addIcons } from 'ionicons';
import { CommonModule } from '@angular/common';
import { searchOutline } from 'ionicons/icons';
import {
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonButtons,
  IonRange,
  IonPopover,
  Platform,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Category, EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  imports: [
    IonButton,
    IonIcon,
    IonDatetime,
    IonDatetimeButton,
    FormsModule,
    IonButtons,
    IonRange,
    CommonModule,
    IonPopover,
    IonSelect,
    IonSelectOption,
  ],
})
export class SearchbarComponent implements OnInit {
  selectedDate = new Date().toISOString();
  title: string = '';
  minPrice = 0;
  maxPrice = 1000;
  isMobile: boolean = false;
  categories: Category[] = [];
  selectedCategory: string = '';
  @Input() isInHomePage: boolean = false;

  constructor(
    private router: Router,
    private platform: Platform,
    private eventService: EventService
  ) {
    addIcons({
      searchOutline,
    });

    this.isMobile =
      this.platform.is('mobile') ||
      this.platform.is('mobileweb') ||
      this.platform.is('capacitor') ||
      this.platform.is('android');
  }

  async ngOnInit() {
    try {
      this.categories = await this.eventService.fetchCategories();
    } catch (error) {
      console.error('Errore nel recupero delle categorie:', error);
    }
  }

  onCategoryChange(event: any) {
    // Il valore selezionato è in event.detail.value
    this.selectedCategory = event.detail.value;
    console.log('Categoria selezionata:', this.selectedCategory);
  }

  dateChanged(event: CustomEvent) {
    this.selectedDate = event.detail.value;
  }

  onMinPriceChange(event: any) {
    console.log('Min Price:', event.target.value);
    // Assicuriamoci che il prezzo minimo non superi il massimo
    if (this.minPrice > this.maxPrice) {
      this.minPrice = this.maxPrice;
    }
  }

  onMaxPriceChange(event: any) {
    // Assicuriamoci che il prezzo massimo non sia inferiore al minimo
    if (this.maxPrice < this.minPrice) {
      this.maxPrice = this.minPrice;
    }
  }

  applyPriceFilter(popover: any) {
    // Qui puoi aggiornare i filtri o altre logiche necessarie
    console.log(
      `Filtro prezzo applicato: min=${this.minPrice}, max=${this.maxPrice}`
    );
    popover.dismiss();
  }

  private convertDateToTimestamp(date: string): number {
    const dateObj = new Date(date);
    // Divido per 1000 perché il backend si aspetta il timestamp in secondi
    return Math.floor(dateObj.getTime() / 1000);
  }

  search() {
    console.log('Data selezionata:', this.selectedDate);
    console.log('nome evento:', this.title);

    const searchParams = {
      title: this.title,
      date: this.convertDateToTimestamp(this.selectedDate),
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      category: this.selectedCategory,
    };

    this.router.navigate(['/search-results'], { queryParams: searchParams });
    this.resetFilters();
  }

  resetFilters() {
    this.title = '';
    this.selectedCategory = '';
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.selectedDate = new Date().toISOString();
  }
}
