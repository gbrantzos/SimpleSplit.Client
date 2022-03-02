import { ComponentRef, Directive, Input, OnChanges, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
import { MatButton } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

// Based on
// https://medium.com/coyo-tech/how-to-add-a-loading-state-to-angular-material-buttons-f0c3272e49a

@Directive({
  selector: `button[mat-button][loading],
             button[mat-raised-button][loading],
             button[mat-icon-button][loading],
             button[mat-fab][loading],
             button[mat-mini-fab][loading],
             button[mat-stroked-button][loading],
             button[mat-flat-button][loading]`
})
export class BaseButtonDirective implements OnChanges{
  @Input() loading: boolean;
  @Input() disabled: boolean;
  @Input() color: any;

  private spinner: ComponentRef<MatProgressSpinner>;

  constructor(private matButton: MatButton,
              private viewContainerRef: ViewContainerRef,
              private renderer: Renderer2) {
  }

  get nativeElement(): HTMLElement {
    return this.matButton._elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.loading) {
      return;
    }

    if (changes.loading.currentValue) {
      this.nativeElement.classList.add('mat-loading');
      this.matButton.disabled = true;
      this.createSpinner();
    } else {
      this.nativeElement.classList.remove('mat-loading');
      this.matButton.disabled = this.disabled;
      this.destroySpinner();
    }
  }

  private createSpinner() {
    if (!this.spinner) {
      this.spinner = this.viewContainerRef.createComponent(MatProgressSpinner);
      this.spinner.instance.diameter = 20;
      this.spinner.instance.color = this.color;
      this.spinner.instance.mode = 'indeterminate';
      this.renderer.appendChild(this.nativeElement, this.spinner.instance._elementRef.nativeElement);
    }
  }

  private destroySpinner() {
    if (this.spinner) {
      this.spinner.destroy();
      this.spinner = null;
    }
  }
}
