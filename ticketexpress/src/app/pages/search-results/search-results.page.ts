import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCol, IonContent, IonGrid, IonRow, Platform} from '@ionic/angular/standalone';
import { HeaderComponent } from "../../components/header/header.component";
import { CardComponent } from 'src/app/components/card/card.component';
import { EventService, Event } from 'src/app/services/event.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent,
    IonGrid, IonRow, IonCol, CardComponent, RouterLink, FooterComponent]
})
export class SearchResultsPage implements OnInit {

  events: Event[] = [];
  isMobile: boolean = false;
  private subs: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private event: EventService,
    private platform: Platform,
  ) {
    this.isMobile = this.platform.is('mobile') || this.platform.is('mobileweb') || 
      this.platform.is('capacitor') || this.platform.is('android');
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.subs.add(
        this.event.searchEvents(params).subscribe({
          next: events => this.events = events,
          error: err => console.error(err)
        })
      )
    })


  }

}
