import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar {
  isOpen = signal<boolean>(false);

  auth = inject(AuthService);
  router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  handleClick = () => {
    this.isOpen.update(prev =>  !prev)
  }

  handleClose = () => {
    this.isOpen.set(false)
  }
}
