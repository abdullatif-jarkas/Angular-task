import { Component, signal } from '@angular/core';
import { PostPopup } from "../post-popup/post-popup";

@Component({
  selector: 'app-text-field',
  imports: [PostPopup],
  templateUrl: './text-field.html',
})
export class TextField {
  showPopup = signal<boolean>(false);

  handleClose = () => {
    this.showPopup.set(false)
  }

  handleClick = () => {
    this.showPopup.set(true)
  }
}
