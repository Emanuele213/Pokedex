import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appOpenMenu]'
})
export class OpenMenuDirective {
  @HostBinding('class.open') isOpen = false;

  constructor() { }

  @HostListener('click') toggleOpen() { 
    this.isOpen = !this.isOpen;
  }
}
