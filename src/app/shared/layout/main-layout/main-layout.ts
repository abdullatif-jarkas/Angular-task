import { Component, inject } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../components/sidebar/sidebar';
import { AuthService } from '../../../services/auth/auth';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [Navbar, RouterOutlet, Sidebar, NgClass],
  templateUrl: './main-layout.html',
})
export class MainLayout {
  auth = inject(AuthService);
  showNews = true;

  closeNews() {
    this.showNews = false;
  }
}
