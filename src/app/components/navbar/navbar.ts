import { NgClass } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavLink } from '../../models/navbar-link.type';
import { NAV_LINKS } from '../../data/navbar-links';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgClass],
  templateUrl: './navbar.html',
})
export class Navbar {
  links: NavLink[] = NAV_LINKS;

  isOpen = signal<boolean>(false);

  scrolled = false;

  handleClick = () => {
    this.isOpen.update(prev =>  !prev)
  }

  handleClose = () => {
    this.isOpen.set(false)
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
  }
}
