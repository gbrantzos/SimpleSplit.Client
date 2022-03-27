import { SelectionModel } from "@angular/cdk/collections";
import { formatDate, formatNumber } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MatSort, MatSortable } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ColumnDefinition, GenericTableDefinition } from "@core/services/schema.models";
import { SortInfo } from "@shared/models/query-parameters";

@Component({
  selector: 'smp-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericTableComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  @Input() definition: GenericTableDefinition;

  @Input() set data(data: { rows: any[], sort: SortInfo }) {
    // Nothing to do, just reset
    if (data.rows?.length == 0) {
      this.rows = [];
      return;
    }

    // Set data
    this.rows = data.rows;
    this.dataSource = new MatTableDataSource(data.rows);
    this.dataSource.sort = this.sort;

    // Set sorting
    if (!this.currentSort
      || data.sort.column !== this.currentSort.column
      || data.sort.direction !== this.currentSort.direction) {
      // To avoid sort changes event that would call set data again, and again ...
      this.suppressSortChanged = true;
      this.sort.sort({id: data.sort.column, start: data.sort.direction} as MatSortable);
      this.currentSort = data.sort;
    }
  }

  @Output() sortChanged: EventEmitter<SortInfo> = new EventEmitter<SortInfo>();
  @Output() cellClicked: EventEmitter<any> = new EventEmitter<any>();

  public rows: any[];
  public selection = new SelectionModel<any>(false);
  public dataSource = new MatTableDataSource<any>([]);

  private currentSort: SortInfo;
  private suppressSortChanged = false;

  constructor(@Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void { }

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

  onCellClicked(row, columnDef: ColumnDefinition) {
    if (!columnDef.enableClickEvent) { return }
    this.cellClicked.emit(row);
  }

  prepareDisplay(row, columnDef): any {
    let rawValue = row[columnDef.name];

    if (columnDef.dateFormat) {
      rawValue = formatDate(rawValue, columnDef.dateFormat, this.locale);
    }
    if (columnDef.numericFormat) {
      rawValue = formatNumber(rawValue, this.locale, columnDef.numericFormat);
    }
    if (columnDef.lookupValues) {
      rawValue = columnDef.lookupValues[rawValue];
    }

    return `${rawValue}${columnDef.suffix ?? ''}`;
  }
}
