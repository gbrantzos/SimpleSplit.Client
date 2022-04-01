import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Expense} from "@features/expenses/services/expenses-store";

@Component({
  selector: 'smp-list-header',
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.scss']
})
export class ListHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() showRefresh: boolean = false;
  @Output() newClicked: EventEmitter<Expense> = new EventEmitter();
  @Output() refreshClicked: EventEmitter<Expense> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onNewClicked = () => this.newClicked.emit();
  onRefreshClicked = () => this.refreshClicked.emit();
}
