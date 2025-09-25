import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgClass, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';

  private auth = inject(AuthService);
  private router = inject(Router);

  onSubmit(form: any) {
    if (form.invalid) {
      return;
    }

    const success = this.auth.login(this.email, this.password);
    if (success) {
      this.router.navigate(['/']);
    } else {
      alert('Invalid email or password!');
    }
  }
}
