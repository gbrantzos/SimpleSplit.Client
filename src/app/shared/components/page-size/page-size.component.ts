import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'smp-page-size',
  templateUrl: './page-size.component.html',
  styleUrls: ['./page-size.component.scss']
})
export class PageSizeComponent implements OnInit {
  @Input() sizes: number[] = [5, 10, 20];
  @Input() currentSize: number = 10;
  @Output() sizeSelected: EventEmitter<number> = new EventEmitter<number>();
  constructor() { }
  ngOnInit(): void { }

  onSizeSelected(size: number) {
    this.currentSize = size;
    this.sizeSelected.emit(size);
  }
}
