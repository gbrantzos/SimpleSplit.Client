import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort, MatSortable } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Expense } from "@features/expenses/services/expenses-store";
import { SortInfo } from "@shared/models/query-parameters";

@Component({
  selector: 'smp-expenses-table',
  templateUrl: './expenses-table.component.html',
  styleUrls: ['./expenses-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesTableComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public selection = new SelectionModel<any>(false);
  public dataSource = new MatTableDataSource<any>([]);
  public availableColumns: string[] = ['id', 'rowVersion', 'description', 'enteredAt', 'amount'];
  public displayedColumns: string[] = ['id', 'description', 'enteredAt', 'amount'];

  public rows: Expense[] = [];

  @Input() set data(data: { rows: Expense[], sort: SortInfo }) {
    if (data.rows?.length == 0) {
      // Nothing to do, just reset
      this.rows = [];
      return;
    }

    // Set data
    this.rows = data.rows;
    this.dataSource = new MatTableDataSource<Expense>(data.rows);
    this.dataSource.sort = this.sort;

    // Set sorting
    if (data.sort.column !== this.currentSort.column || data.sort.direction !== this.currentSort.direction) {
      this.suppressSortChanged = true; // To avoid sort changes event that would call set data again, and again ...
      this.sort.sort({id: data.sort.column, start: data.sort.direction} as MatSortable);
      this.currentSort = data.sort;
    }
  }

  private currentSort: SortInfo = {column: 'enteredAt', direction: 'desc'};
  private suppressSortChanged = false;

  @Output() expenseClicked: EventEmitter<Expense> = new EventEmitter();
  @Output() sortChanged: EventEmitter<SortInfo> = new EventEmitter<SortInfo>();

  constructor() { }

  ngOnInit(): void {
    this.sort.sort({id: 'enteredAt', start: 'desc'} as MatSortable);
    this.dataSource.sort = this.sort;
  }

  onCellClicked(element: Expense): void {
    this.expenseClicked.emit(element);
  }

  onSortChanged(event) {
    if (this.rows.length === 0) { return; }
    if (this.suppressSortChanged) {
      this.suppressSortChanged = false;
      return;
    }
    this.currentSort = {
      column: event.active,
      direction: event.direction
    }
    this.sortChanged.emit(this.currentSort);
  }
}
