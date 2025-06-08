import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormControl,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonCheckbox,
  IonHeader,
  IonToolbar,
  Platform,
  IonBackButton,
  IonModal,
  IonTitle,
  IonButtons,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Category, EventService } from 'src/app/services/event.service';
import { CategoryCardComponent } from 'src/app/components/category-card/category-card.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
    IonCheckbox,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonModal,
    IonTitle,
    IonButtons,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    CategoryCardComponent,
  ],
})
export class RegisterPage implements OnInit {
  passwordFieldType: string = 'password';
  registerForm!: FormGroup;
  errorMessage: string = '';
  isMobile: boolean = false;
  isModalOpen: boolean = false;
  showCategoriesSection: boolean = false;

  categories: Category[] = [];
  selectedCategories: number[] = [];

  constructor(
    private auth: AuthService,
    private platform: Platform,
    private router: Router,
    private eventService: EventService,
    private userService: UserService
  ) {
    addIcons({ closeOutline });
    this.isMobile =
      this.platform.is('mobile') ||
      this.platform.is('mobileweb') ||
      this.platform.is('android') ||
      this.platform.is('capacitor');
  }

  ngOnInit() {
    this.registerForm = new FormGroup(
      {
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          this.passwordValidator,
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
        rememberMe: new FormControl(false),
      },
      { validators: this.comparePasswords }
    );
  }

  private passwordValidator(control: FormControl): ValidationErrors | null {
    const password = control.value;
    const minLength = 6;
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/;

    if (password.length < minLength) {
      return { minLength: 'La password deve avere almeno 6 caratteri' };
    }

    if (!regex.test(password)) {
      return {
        invalidPassword:
          'La password deve contenere almeno una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale',
      };
    }

    return null;
  }

  private comparePasswords(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: 'Le password non coincidono' };
    }

    return null;
  }

  togglePasswordVisibility(event: any) {
    this.passwordFieldType = event.detail.checked ? 'text' : 'password';
  }

  async onSubmit() {
    console.log(this.registerForm.value);
    try {
      await this.auth.register(
        this.registerForm.value.firstName,
        this.registerForm.value.lastName,
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.confirmPassword,
        this.registerForm.value.rememberMe
      );
      this.categories = await this.eventService.fetchCategories();
      if (this.isMobile) {
        this.isModalOpen = true;
      } else {
        this.showCategoriesSection = true;
        // Scroll alla sezione categorie
        setTimeout(() => {
          const element = document.querySelector('.categories-section');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } catch (error: any) {
      console.error('Errore durante la registrazione:', error.message);
    }
  }

  skipCategories() {
    // Naviga senza salvare categorie
    this.router.navigate(['/']);
  }

  onModalClose() {
    this.isModalOpen = false;
    // Salva le categorie e naviga
    this.router.navigate(['/']);
  }

  async saveSelectedCategories() {
    this.isModalOpen = false;
    try {
      await Promise.all(
        this.selectedCategories.map((categoryID) => {
          console.log(categoryID);
          return this.userService.addFavoriteCategory(categoryID);
        })
      );
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error(
        "Errore durante l'aggiunta delle categorie preferite:",
        error.message
      );
    }
  }

  toggleCategory(categoryId: number) {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index > -1) {
      // Se la categoria è già selezionata, rimuovila
      this.selectedCategories.splice(index, 1);
    } else {
      // Altrimenti aggiungila
      this.selectedCategories.push(categoryId);
    }
    console.log(this.selectedCategories);
  }

  isSelected(categoryId: number): boolean {
    return this.selectedCategories.includes(categoryId);
  }
}
