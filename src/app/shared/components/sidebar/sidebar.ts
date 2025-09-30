import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, NgClass],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  auth = inject(AuthService);
  translate = inject(TranslateService);  
}
