import { Component, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements AfterViewInit {
  popUp: boolean = false;
  popupOpened: boolean = false;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    const popupShown = localStorage.getItem('popupShown');
    if (!popupShown) {
      this.popUpStart();
      localStorage.setItem('popupShown', 'true');
    }
  }

  popUpStart() {
    setTimeout(() => {
      this.popUp = true;
    }, 2000);
  }
}
