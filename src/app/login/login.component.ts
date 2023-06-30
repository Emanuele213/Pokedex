import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(private formBuilder: FormBuilder, @Inject(AuthService) public authService: AuthService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;

    if (this.authService.login(email, password)) {
      // Reindirizza alla pagina di home dopo l'autenticazione riuscita
      this.router.navigate(['/home']);
    } else {
      // Gestisci l'autenticazione fallita, ad esempio visualizzando un messaggio di errore
      this.loginError = 'Credenziali non valide. Utente non registrato.';
    }
  }
}
