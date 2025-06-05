import { Component, inject, Input, OnInit } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  imports: [],
})
export class PanelComponent  implements OnInit {

  @Input() images: string[] = [];
  @Input() isStatic: boolean = true;
  @Input() events: any[] = [];

  defaultImage: string = '../../../assets/images/default-event.png';
  private currentIndex: number = 0;
  currentImage: string = this.defaultImage;
  private interval?: number;
  router = inject(Router);

  constructor(private imageService: ImageService) {}

  ngOnInit() {

  }
  
  ngOnChanges() {
    
    console.log('ngOnChanges called with images:', this.images[0]);
    
    for (let i = 0; i < this.images.length; i++) {
      this.images[i] = this.imageService.getEventImageUrl(this.images[i]);
    }
    
    this.currentImage = this.images[0] || this.defaultImage;
    if (!this.isStatic) {
      clearInterval(this.interval);
      this.startChange();
    }
  }

  ngOnDestroy() {
    this.stopChange();
  }

  private startChange() {
    this.interval = window.setInterval(() => {
      this.changeImage();
    }, 3000);
  }

  private stopChange() {
    // Pulisce l'intervallo se esiste
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  private changeImage() {
    
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.currentImage = this.images[this.currentIndex];
    
  }

  navigateToEvent() {
    const event = this.events[this.currentIndex];
    if (event) {
      this.router.navigate(
        ['/event', event.eventID],
        { state: { event } }
      );
    }
  }
}
