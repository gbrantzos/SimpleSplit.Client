import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[smp-base-button]'
})
export class BaseButtonDirective {
  constructor(elRef: ElementRef) {
    elRef.nativeElement.style.background = 'rgba(218, 83, 16, 1)';
    elRef.nativeElement.style.color = '#FFFFFF';
  }
}