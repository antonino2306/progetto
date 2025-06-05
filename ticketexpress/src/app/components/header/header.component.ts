import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonBadge,
  Platform,
  IonBackButton,
  IonSearchbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline,logInOutline,personCircleOutline } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { Subscription } from 'rxjs';
import { SearchbarComponent } from "../searchbar/searchbar.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    RouterLink,
    CommonModule,
    IonBadge,
    IonBackButton,
    SearchbarComponent,
],
})
export class HeaderComponent {
  @Input() title: string | undefined = 'TicketExpress';
  @Input() showBackButton: boolean = false;
  @Input() showUserButton: boolean = true;
  @Input() showSearchbar: boolean = true;
  isAuthenticated!: boolean;
  user!: User | null;
  cartElements: number = 0;
  isMobile: boolean = false;
  private subs: Subscription = new Subscription();

  constructor(
    private auth: AuthService,
    private cartService: CartService,
    private platform: Platform,
    private router: Router
  ) {
    addIcons({
      cartOutline,
      personCircleOutline,
      logInOutline
    });

    this.isMobile =
      this.platform.is('mobile') ||
      this.platform.is('mobileweb') ||
      this.platform.is('capacitor') ||
      this.platform.is('android');

    this.subs.add(
      this.auth.isLoggedIn$.subscribe((isLoggedIn) => {
        this.isAuthenticated = isLoggedIn;
        console.log('isAuthenticated:', this.isAuthenticated);
      })
    );

    this.subs.add(
      this.auth.user$.subscribe((user) => {
        this.user = user;
        console.log('User:', this.user);
      })
    );

    this.subs.add(
      this.cartService.cart.subscribe((cart) => {
        this.cartElements = 0;
        cart.forEach((item: any) => {
          this.cartElements += item.quantity;
        });
      })
    );
  }

  redirectHome() {
    if (this.title === 'TicketExpress') {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    console.log('isAuthenticated:', this.isAuthenticated);
    console.log('User:', this.user);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }


}
