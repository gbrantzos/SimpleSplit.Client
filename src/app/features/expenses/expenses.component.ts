import { Component, HostBinding, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";
import { Expense, ExpensesStore } from '@features/expenses/services/expenses-store';
import { debounceTime, distinctUntilChanged, Observable, startWith } from 'rxjs';
import { SubSink } from "subsink";
import { PagedResult } from "@shared/models/paged-result";
import { PaginatorEvent } from "@shared/components/paginator/paginator.component";
import { QueryParameters, SortInfo } from "@shared/models/query-parameters";
import * as moment from 'moment';
import { FormControl, FormGroup } from "@angular/forms";
import { ExpensesEditorComponent } from "@features/expenses/components/expenses-editor/expenses-editor.component";

@Component({
  selector: 'smp-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'base-component';
  @ViewChild("sidenav") public sidenav: MatSidenav;
  @ViewChild('sidenavView', {read: ViewContainerRef}) vrf: ViewContainerRef;

  private static readonly StorageKey = 'ExpensesList_QueryParameters'
  private subs = new SubSink();
  private searchDelay: number = 400;

  public loading: boolean = true;
  public errorMessage: string;
  public expenses$: Observable<PagedResult<Expense>>;
  public pageSize: number = 10;
  public currentParams: QueryParameters;
  public searchForm: FormGroup;

  constructor(private expensesStore: ExpensesStore) {
    this.expenses$ = expensesStore.expenses;
    this.subs.sink = this.expensesStore.errors.subscribe(msg => this.errorMessage = msg);
    this.subs.sink = this.expensesStore.loading.subscribe(loading => this.loading = loading);
  }

  public loadData() {
    localStorage.setItem(ExpensesComponent.StorageKey, JSON.stringify(this.currentParams));
    this.expensesStore.load(this.currentParams);
  }

  private listenToSearchInputChanges() {
    this.subs.sink = this.searchForm.get('searchValue')
      .valueChanges
      .pipe(
        startWith(''),
        debounceTime(this.searchDelay),
        distinctUntilChanged()
      ).subscribe({
          next: search => {
            if (search !== this.currentParams.criteria) { this.currentParams.pageNumber = 1 }
            this.currentParams = {
              ...this.currentParams,
              criteria: search
            }
            this.loadData();
          },
          error: err => console.error(err)
        }
      );
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchValue: new FormControl()
    });
    this.listenToSearchInputChanges();

    const values = localStorage.getItem(ExpensesComponent.StorageKey);
    this.currentParams = JSON.parse(values) || {
      pageNumber: 1,
      pageSize: this.pageSize,
      sort: {
        column: 'enteredAt',
        direction: 'desc'
      }
    };
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onNew() {
    this.displayEditor({
      id: 0,
      rowVersion: 0,
      description: '<<Περιγραφή>>',
      enteredAt: moment().startOf('day').toDate(),
      amount: 0,
      category: undefined,
      isOwnerCharge: false
    });
  }

  onExpenseClick = (expense: Expense) => this.displayEditor({...expense});

  onRefresh = () => this.loadData();

  onPaginatorChanges(changes: PaginatorEvent) {
    if (changes.pageNumber == this.currentParams.pageNumber &&
      changes.pageSize == this.currentParams.pageSize) { return; }
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

  displayEditor(expense: Expense) {
    this.vrf.clear();
    const componentRef = this.vrf.createComponent(ExpensesEditorComponent);
    componentRef.instance.sidenavHost = this.sidenav;
    componentRef.instance.expense = expense;
    componentRef.instance.host = this;
    this.sidenav.open()
  }

  clearSearch = () => this.searchForm.reset();

  dataInfo(data: PagedResult<Expense>): string {
    if (data.rows.length === 0) {
      return '';
    }

    const from = (data.currentPage - 1) * data.pageSize + 1;
    const to = Math.min((data.currentPage) * data.pageSize, data.totalRows);
    return `Εμφάνιση ${from} - ${to} από σύνολο ${data.totalRows} εγγραφών`;
  }

}
