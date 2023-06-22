import { Directive, Renderer2, ElementRef, HostListener, OnInit, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appBetterHighlight]'
})
export class BetterHighlightDirective implements OnInit {
  @Input() defaultColor: string = '#9db0c6';
  @Input() highlightColor: string = '#6e726d';
  constructor(private renderer: Renderer2, 
              private elRef: ElementRef //-- imposta lo stile con .nativeElement
              ) { } 
  
  ngOnInit() {

  }
  @HostBinding ('style.boxShadow') boxShadow: string = this.defaultColor; // usare camelCase per scrivere con hostBinding
  
  @HostListener('mouseenter') mouseover(eventData: Event) {
    this.renderer.setStyle(this.elRef.nativeElement, 'box-shadow', '-0.5px 0 0 10px');
    this.boxShadow = this.highlightColor;
  }

  @HostListener('mouseleave') mouseleave(eventData: Event) {
    this.renderer.setStyle(this.elRef.nativeElement, 'box-shadow', '-0.5px 0 0 8px #9db0c6');
  }
}
