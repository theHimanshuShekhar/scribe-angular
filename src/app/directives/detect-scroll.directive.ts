import { Directive, HostListener, Output, EventEmitter, Input } from '@angular/core';

@Directive({
  selector: '[appDetectScroll]'
})
export class DetectScrollDirective {
  @Output() scrollPosition = new EventEmitter()

  constructor() { }

  @HostListener('window:scroll', ['$event']) public windowScrolled($event: Event) {
    this.windowScrollEvent($event);
  }

  protected windowScrollEvent($event: Event) {
    const target = <Document>$event.target;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const windowHeight = target.documentElement.scrollHeight;
    
    const offset = windowHeight - scrollTop;
    if (offset - target.documentElement.clientHeight === 0) {
      this.scrollPosition.emit('bottom');
    }
  }

}
