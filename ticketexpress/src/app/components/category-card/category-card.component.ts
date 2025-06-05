import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonCard, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { Category } from 'src/app/services/event.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss'],
  imports: [IonCard, IonCardHeader, IonCardTitle],
})
export class CategoryCardComponent  implements OnInit {

  @Input() category!: Category;
  @Input() blockRedirect: boolean = false;

  constructor(private router: Router, private imageService: ImageService) {}

  ngOnInit() {
    this.category.imageUrl = this.imageService.getCategoryImageUrl(this.category.imageUrl);
  }

  redirect() {
    if (!this.blockRedirect) {
      this.router.navigate(['/category', this.category.name]);
    }
  }

}
