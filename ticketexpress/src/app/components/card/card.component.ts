import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  imports: [
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonIcon,
    CommonModule,
    IonButton
  ],
})
export class CardComponent implements OnInit {
  @Input() title: string = '';
  @Input() artist: string = 'Artista';
  @Input() price: number = 25;
  @Input() isExpanded: boolean = true;
  @Input() myTicket: boolean = false;
  @Input() imageUrl: string = '';

  constructor(private imageService: ImageService) {
    addIcons({
      chevronForwardOutline,
    });
  }

  ngOnInit() {
    this.imageUrl = this.imageService.getEventImageUrl(this.imageUrl);
  }
}
