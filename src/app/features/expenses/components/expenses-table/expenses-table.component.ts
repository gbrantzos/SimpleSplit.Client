import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort, MatSortable } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Expense } from "@features/expenses/services/expenses-store";

@Component({
  selector: 'smp-expenses-table',
  templateUrl: './expenses-table.component.html',
  styleUrls: ['./expenses-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesTableComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  public selection = new SelectionModel<any>(false);
  public availableColumns: string[] = ['id', 'rowVersion', 'description', 'enteredAt', 'amount'];
  public displayedColumns: string[] = ['id', 'description', 'enteredAt', 'amount'];

  private $data!: Expense[];
  get data(): Expense[] {
    return this.$data;
  }
  @Input() set data(expenses: Expense[]) {
    this.$data = expenses;
    this.dataSource = new MatTableDataSource<any>(expenses);
    this.dataSource.sort = this.sort;
  }
  public dataSource = new MatTableDataSource<any>([]);

  @Output() expenseClicked: EventEmitter<Expense> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.sort.sort({ id: 'enteredAt', start: 'desc' } as MatSortable);
    this.dataSource.sort = this.sort;
  }

  onCellClicked(element: Expense): void {
    this.expenseClicked.emit(element);
  }
}
