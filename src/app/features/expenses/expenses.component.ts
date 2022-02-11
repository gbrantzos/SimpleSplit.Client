import { Component, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";
import { Expense, ExpensesStore } from '@features/expenses/services/expenses-store';
import { Observable } from 'rxjs';
import { SubSink } from "subsink";
import { PagedResult } from "@shared/models/paged-result";
import { PaginatorEvent } from "@shared/components/paginator/paginator.component";
import { QueryParameters, SortInfo } from "@shared/models/query-parameters";

@Component({
  selector: 'smp-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'base-component';
  @ViewChild("sidenav") public sidenav: MatSidenav;

  private static readonly StorageKey = 'ExpensesList_QueryParameters'
  private subs = new SubSink();

  public loading: boolean = true;
  public errorMessage: string;
  public expenses$: Observable<PagedResult<Expense>>;
  public pageSize: number = 10;
  public currentParams: QueryParameters;

  constructor(private expensesStore: ExpensesStore) {
    this.expenses$ = expensesStore.expenses;
    this.subs.sink = this.expensesStore.errors.subscribe(msg => this.errorMessage = msg);
    this.subs.sink = this.expensesStore.loading.subscribe(loading => this.loading = loading);
  }

  private loadData() {
    localStorage.setItem(ExpensesComponent.StorageKey, JSON.stringify(this.currentParams));
    this.expensesStore.load(this.currentParams);
  }

  ngOnInit(): void {
    const values = localStorage.getItem(ExpensesComponent.StorageKey);
    this.currentParams = JSON.parse(values) || {
      pageNumber: 1,
      pageSize: this.pageSize,
      sort: {
        column: 'enteredAt',
        direction: 'desc'
      }
    };
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onNew() {
    this.sidenav.open();
  }

  onExpenseClick(expense: Expense) {
    alert(expense.description);
    console.log(expense);
  }

  onSearch() {
    this.loadData();
  }

  dataInfo(data: PagedResult<Expense>): string {
    if (data.rows.length === 0) {
      return '';
    }

    const from = (data.currentPage - 1) * data.pageSize + 1;
    const to = Math.min((data.currentPage) * data.pageSize, data.totalRows);
    return `Εμφάνιση ${from} - ${to} από σύνολο ${data.totalRows} εγγραφών`;
  }

  onPaginatorChanges(changes: PaginatorEvent) {
    this.currentParams = {
      ...this.currentParams,
      pageNumber: changes.pageNumber,
      pageSize: changes.pageSize
    };
    this.loadData();
  }

  onSortChanged(changes: SortInfo) {
    if (changes.column == this.currentParams.sort.column &&
      changes.direction == this.currentParams.sort.direction) { return; }
    this.currentParams = {
      ...this.currentParams,
      sort: {
        column: changes.column,
        direction: changes.direction
      }
    };
    this.loadData();
  }
}
