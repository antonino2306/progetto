import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { SearchbarComponent } from "../../components/searchbar/searchbar.component";
import { RouterLink } from '@angular/router';
import { Category, EventService } from 'src/app/services/event.service';
import { CategoryCardComponent } from 'src/app/components/category-card/category-card.component';
import { CartComponent } from 'src/app/components/cart/cart.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, SearchbarComponent, 
    IonGrid, IonRow, IonCol, IonTitle, CategoryCardComponent, CartComponent]
})
export class SearchPage implements OnInit {

  categories: Category[] = [];
  constructor(private event: EventService) {
  }
  
  async ngOnInit() {
    // this.categories = this.event.categories;
    try {
      this.categories = await this.event.fetchCategories();
      console.log("Fetched categories:", this.categories)
    } catch (error) {
      console.error('Error fetching events:', error);
    }
    
  }

}
