import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';

  private auth = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    const success = this.auth.login(this.email, this.password);
    if (success) {
      this.router.navigate(['/']);
    } else {
      alert('Invalid email or password!');
    }
  }
}
