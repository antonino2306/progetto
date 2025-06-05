import { Component,OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonItem,
  IonButton,
  IonInput,
} from '@ionic/angular/standalone';
import { RecoveryService } from 'src/app/services/recovery.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonItem,
    IonButton,
    IonInput,
  ],
})
export class PasswordRecoveryPage implements OnInit {
  recoveryForm!: FormGroup;
  errorMessage: string = '';
  

  constructor(private router: Router, private recoveryService: RecoveryService) {}

  ngOnInit() {
    this.recoveryForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ionViewWillEnter() {
    this.errorMessage = '';
    this.recoveryForm.reset();
  }

  async onSubmit() {
    this.errorMessage = '';

    this.recoveryService
      .isEmailValid(this.recoveryForm.value.email)
      .then((exists) => {
        if (!exists) {
          this.errorMessage = 'Email non trovata';
        } else {
          this.recoveryService
            .forgotPassword(this.recoveryForm.value.email)
            .then(() => {
              this.router.navigate(['/login']);
            })
            .catch((error) => {
              console.error('Error:', error);
              this.errorMessage = "Errore durante l'invio dell'email";
            });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        this.errorMessage = 'Utente non trovato';
      });
  }

}
