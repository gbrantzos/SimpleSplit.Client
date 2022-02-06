import {Component, HostBinding, OnInit, ViewChild} from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";
import { Expense, ExpensesStore } from '@features/expenses/services/expenses-store';
import { Observable } from 'rxjs';

@Component({
  selector: 'smp-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  @HostBinding('class') class = 'base-component';

  public expenses$: Observable<Expense[]>;
  @ViewChild("sidenav") public sidenav: MatSidenav;

  constructor(private expensesStore: ExpensesStore) {
    this.expenses$ = expensesStore.expenses;
  }

  ngOnInit(): void {
    this.expensesStore.load();
  }

  onNew() {
    this.sidenav.open();
  }
  onExpenseClick(expense: Expense) {
    alert(expense.description);
    console.log(expense);
  }

  onSearch() {
    this.expensesStore.load();
  }
}
