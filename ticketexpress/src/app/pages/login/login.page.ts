import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonCheckbox, IonButton, IonInput, IonItem, IonLabel, IonInputPasswordToggle } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service'; 
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, ReactiveFormsModule, IonItem, IonLabel, IonButton, IonInput, IonCheckbox, IonInputPasswordToggle]
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;
  authService: AuthService = inject(AuthService);
  router = inject(Router);
  errorMessage: string = '';
  showPassword: boolean = false;
  loginFailed: boolean = false;

  constructor() { }

  ngOnInit() {
    
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      rememberMe: new FormControl(false)
    })
  }

  //viene chimato ogni volta che la pagina viene visualizzata
  //utile per resettare il form e gli errori 
  ionViewWillEnter() {
    this.loginFailed = false;
    this.errorMessage = '';
    this.loginForm.reset();
  }

  async onSubmit() {
    console.log(this.loginForm.value.email, this.loginForm.value.password);
    try {
      const response = await this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
      console.log('Risposta:', response);
    }
    catch (error: any) {
      console.error('error:', error.message);
      this.errorMessage = error.message;
      this.loginFailed = true;
    }

  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

   goToPasswordRecovery() {
    this.router.navigate(['/password-recovery']);
  }


  toggleShowPassword(event: any) {
    this.showPassword = event.detail.checked;
  }
}
