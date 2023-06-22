import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'first-ex';
  
  getFormattedImagePath(id: number): string {
    if (id !== undefined && id !== null) {
      const formattedId = this.formatID(id);
      return `assets/img/${formattedId}.png`;
    }
    return '';
  }
  
  formatID(id: number): string {
    if (id >= 100) {
      return id.toString();
    } else if (id >= 10) {
      return `0${id}`;
    } else {
      return `00${id}`;
    }
  }
  
}
