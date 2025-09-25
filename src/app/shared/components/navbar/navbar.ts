import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  isOpen = signal<boolean>(false);
  userAvatar: string = 'assets/images/default-avatar.png';

  auth = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
    const user = this.auth.getUser();
    if (user) {
      this.userAvatar = `https://randomuser.me/api/portraits/men/${user.id}.jpg`;
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/default-avatar.png';
  }

  handleClick = () => {
    this.isOpen.update((prev) => !prev);
  };

  handleClose = () => {
    this.isOpen.set(false);
  };
}
