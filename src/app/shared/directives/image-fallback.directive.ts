import { Directive, ElementRef, HostListener, Input } from '@angular/core';

// Ideas from
// https://mdmoin07.medium.com/image-fallback-for-broken-images-angular-aa3d5538ea0

@Directive({
  selector: 'img[fallback]'
})
export class ImageFallbackDirective {
  @Input() fallbackImage: string;

  constructor(private eRef: ElementRef) { }

  @HostListener('error') loadFallback() {
    const element: HTMLImageElement = <HTMLImageElement>this.eRef.nativeElement;
    element.src = this.fallbackImage || 'assets/images/placeholder-image.png';
  }
}
