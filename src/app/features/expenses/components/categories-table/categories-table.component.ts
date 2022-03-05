import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { Category } from "@features/expenses/services/categories-store";

@Component({
  selector: 'smp-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss']
})
export class CategoriesTableComponent implements OnInit {
  @Output() categoryClicked: EventEmitter<Category> = new EventEmitter();

  public dataSource = new MatTableDataSource<any>([]);
  public availableColumns: string[] = ['id', 'description', 'kind'];
  public displayedColumns: string[] = ['description', 'kind'];

  public rows: Category[] = [];

  @Input() set data(data: Category[]) {
    if (data?.length == 0) {
      // Nothing to do, just reset
      this.rows = [];
      return;
    }

    this.rows = data;
    this.dataSource = new MatTableDataSource<Category>(data);
  }

  constructor() { }

  ngOnInit(): void { }

  onCellClicked(element: Category): void {
    this.categoryClicked.emit(element);
  }

  displayValue(kind: number): string {
    switch (kind) {
      case 1: { return 'Θερμανση'; }
      case 2: { return 'Ανελκυστήρας'; }
      case 3: { return 'Λοιπά'; }
      default : { return `UNKNOWN KIND - ${kind}`}
    }
  }

}
