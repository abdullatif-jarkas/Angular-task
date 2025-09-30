import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  @Output() burgerClick = new EventEmitter<void>();

  isOpen = signal<boolean>(false);
  translate = inject(TranslateService);

  userAvatar: string = 'assets/images/default-avatar.png';
  currentFlag = 'flags/en.png';

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

  handleClick() {
    this.burgerClick.emit();
  }

  handleClose = () => {
    this.isOpen.set(false);
  };

  toggleLang() {
    const current = this.translate.currentLang;
    if (current === 'en') {
      this.translate.use('ar');
      this.currentFlag = 'flags/ar.png';
    } else {
      this.translate.use('en');
      this.currentFlag = 'flags/en.png';
    }
  }
}
