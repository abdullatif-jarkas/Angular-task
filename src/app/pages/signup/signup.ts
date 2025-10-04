import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink, NgClass],
  templateUrl: './signup.html',
})
export class Signup {
  name = '';
  email = '';
  password = '';

  private auth = inject(AuthService);
  private router = inject(Router);

  onSignup(form: any) {
    if (form.valid) {
      const success = this.auth.signup(this.name, this.email, this.password);
      if (success) {
        this.router.navigate(['/']);
      } else {
        alert('This email is already registered!');
      }
    }
  }
}
