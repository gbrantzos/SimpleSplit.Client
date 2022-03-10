import { Component, HostBinding, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";
import { ExpensesEditorComponent } from "@features/expenses/components/expenses-editor/expenses-editor.component";
import { CategoriesStore } from "@features/expenses/services/categories-store";
import { Expense, ExpensesStore } from "@features/expenses/services/expenses-store";
import { GenericListDefinition } from "@shared/components/generic-list/generic-list.component";
import { QueryParameters } from "@shared/models/query-parameters";
import { StoreState } from "@shared/services/generic-store.service";
import * as moment from "moment";
import { Observable } from "rxjs";

@Component({
  selector: 'smp-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss']
})
export class ExpensesListComponent implements OnInit {
  @HostBinding('class') class = 'base-component';
  @ViewChild("sidenav") public sidenav: MatSidenav;
  @ViewChild('sidenavView', {read: ViewContainerRef}) vrf: ViewContainerRef;

  public state$: Observable<StoreState<Expense>>;
  public currentParams: QueryParameters;

  public listDefinition: GenericListDefinition = {
    name: 'ExpensesList',
    header: 'Λίστα Εξόδων',
    storageKey: 'ExpensesList_QueryParameters',
    defaultPageSize: 10,
    pageSizes: [5, 10, 20],
    tableDefinition: {
      availableColumns: [{
        name: 'id',
        label: 'Α/Α'
      }, {
        name: 'rowVersion'
      }, {
        name: 'description',
        label: 'Περιγραφή',
        class: 'hover-link',
        enableClickEvent: true
      }, {
        name: 'enteredAt',
        label: 'Ημ/νια Καταχώρισης',
        dateFormat: 'dd/MM/yyyy'
      }, {
        name: 'amount',
        label: 'Αξια',
        class: 'value',
        sortProperty: "amount.amount",
        arrowPosition: "before",
        numericFormat: '1.2-2',
        suffix: ' €'
      }],
      displayedColumns: ['description', 'enteredAt', 'amount'],
      defaultSort: {
        column: 'enteredAt',
        direction: 'desc'
      },
    }
  }

  constructor(private expensesStore: ExpensesStore) { this.state$ = this.expensesStore.items; }

  ngOnInit(): void { }

  loadData() { this.expensesStore.load(this.currentParams); }

  onRefresh() { this.loadData(); }

  onParamsChanged(params: QueryParameters) {
    this.currentParams = {...params};
    this.loadData();
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

  onTableClicked(expense: Expense) { this.displayEditor({...expense}); }

  displayEditor(expense: Expense) {
    this.vrf.clear();
    const componentRef = this.vrf.createComponent(ExpensesEditorComponent);
    componentRef.instance.sidenavHost = this.sidenav;
    componentRef.instance.expense = expense;
    componentRef.instance.onSuccess = (_) => { this.loadData(); }
    this.sidenav.open()
  }
}
