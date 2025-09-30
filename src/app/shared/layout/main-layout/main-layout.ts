import { Component, inject, signal } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../components/sidebar/sidebar';
import { AuthService } from '../../../services/auth/auth';
import { NgClass } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-layout',
  imports: [Navbar, RouterOutlet, Sidebar, NgClass, TranslatePipe],
  templateUrl: './main-layout.html',
})
export class MainLayout {
  auth = inject(AuthService);
  translate = inject(TranslateService)
  showNews = true;

  sidebarOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeNews() {
    this.showNews = false;
  }
}
