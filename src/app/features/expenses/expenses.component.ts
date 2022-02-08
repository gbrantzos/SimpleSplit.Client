import { Component, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";
import { Expense, ExpensesStore } from '@features/expenses/services/expenses-store';
import { Observable } from 'rxjs';
import { SubSink } from "subsink";

@Component({
  selector: 'smp-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'base-component';
  @ViewChild("sidenav") public sidenav: MatSidenav;

  public loading: boolean = true;
  public errorMessage: string;
  public expenses$: Observable<Expense[]>;
  private subs = new SubSink();

  constructor(private expensesStore: ExpensesStore) {
    this.expenses$ = expensesStore.expenses;
    this.subs.sink = this.expensesStore.errors.subscribe(msg => this.errorMessage = msg);
    this.subs.sink = this.expensesStore.loading.subscribe(loading => this.loading = loading);
  }

  private loadData() {
    this.expensesStore.load();
  }

  ngOnInit(): void {
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
}
