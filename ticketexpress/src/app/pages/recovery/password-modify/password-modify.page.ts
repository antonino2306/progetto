import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import {
  IonCardContent,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonCheckbox,
  IonContent,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { RecoveryService } from 'src/app/services/recovery.service';
import { Router, ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { checkmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-password-modify',
  templateUrl: './password-modify.page.html',
  styleUrls: ['./password-modify.page.scss'],
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
  ],
})
export class PasswordModifyPage implements OnInit {
  passwordFieldType: string = 'password';
  modifyForm!: FormGroup;
  errorMessage: string = '';
  router = inject(Router);
  token: string = '';
  isResettedPassword: boolean = false;

  constructor(
    private auth: AuthService,
    private recoveryService: RecoveryService,
    private route: ActivatedRoute
  ) {
    addIcons({ checkmarkOutline, })
  }

  ngOnInit() {
    this.modifyForm = new FormGroup(
      {
        password: new FormControl('',[Validators.required, this.passwordValidator],[]),
        confirmPassword: new FormControl('', [Validators.required], []),
      },
      { validators: this.comparePasswords }
    );

    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      // ora puoi usare this.token per inviare la richiesta di reset
    });
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
    const password = this.modifyForm.value.password;
    // Passa anche il token alla funzione di reset
    const response = await this.recoveryService.resetPassword(
      this.token,
      password
    );
    if (response.success) this.isResettedPassword = true;

    console.log(response);
  }
}
