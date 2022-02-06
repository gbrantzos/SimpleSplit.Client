import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Expense} from "@features/expenses/services/expenses-store";

@Component({
  selector: 'smp-list-header',
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.scss']
})
export class ListHeaderComponent implements OnInit {
  @Input() title: string;
  @Output() newClicked: EventEmitter<Expense> = new EventEmitter();
  @Output() searchClicked: EventEmitter<Expense> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onNewClicked = () => this.newClicked.emit();
  onSearchClicked = () => this.searchClicked.emit();
}
