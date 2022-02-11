import { Component, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";
import { Expense, ExpensesStore } from '@features/expenses/services/expenses-store';
import { Observable } from 'rxjs';
import { SubSink } from "subsink";
import { PagedResult } from "@shared/models/paged-result";
import { PaginatorEvent } from "@shared/components/paginator/paginator.component";
import { QueryParameters } from "@shared/models/query-parameters";

@Component({
  selector: 'smp-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'base-component';
  @ViewChild("sidenav") public sidenav: MatSidenav;

  public pageSize: number = 10;
  public loading: boolean = true;
  public errorMessage: string;
  public expenses$: Observable<PagedResult<Expense>>;
  private subs = new SubSink();
  private currentParams: QueryParameters;

  constructor(private expensesStore: ExpensesStore) {
    this.expenses$ = expensesStore.expenses;
    this.subs.sink = this.expensesStore.errors.subscribe(msg => this.errorMessage = msg);
    this.subs.sink = this.expensesStore.loading.subscribe(loading => this.loading = loading);
  }

  private loadData() {
    this.expensesStore.load(this.currentParams);
  }

  ngOnInit(): void {
    this.currentParams = {
      pageNumber: 1,
      pageSize: this.pageSize
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
}
