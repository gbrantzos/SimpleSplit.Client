import { Component, HostBinding, Injector, OnInit, SkipSelf, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";
import { ExpensesEditorComponent } from "@features/expenses/components/expenses-editor/expenses-editor.component";
import { CategoriesStore, CategoryKinds } from "@features/expenses/services/categories-store";
import { Expense, ExpensesStore } from "@features/expenses/services/expenses-store";
import { AdvancedSearchComponent } from '@shared/components/advanced-search/advanced-search.component';
import {
  ADVANCED_SEARCH_SETUP,
  AdvancedSearchSetup, ConditionGroup,
  CriteriaDefinition
} from "@shared/components/advanced-search/advanced-search.models";
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
    searchProperty: 'description',
    enableAdvancedSearch: true,
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
  public searchDefinition: CriteriaDefinition[] = [
    {property: 'description', label: 'Περιγραφή', 'input': 'text'},
    {property: 'enteredAt', label: 'Ημερομηνία', 'input': 'date'},
    {
      property: 'kind', label: 'Ομάδα Εξόδων', 'input': 'select', multi: true, lookupValues: CategoryKinds
    },
    {
      property: 'category',
      label: 'Κατηγορία Εξόδων',
      input: 'select',
      multi: true,
      lookupValuesAsync: this.categoriesStore.categories
    },
    {property: 'forOwner', label: 'Επιβάρυνση ιδιοκτήτη', input: 'checkbox'}
  ]

  private conditions: ConditionGroup;

  constructor(private expensesStore: ExpensesStore,
              private categoriesStore: CategoriesStore,
              @SkipSelf() private injector: Injector) {
    this.state$ = this.expensesStore.items;
  }

  ngOnInit(): void { }

  loadData() { this.expensesStore.load(this.currentParams); }

  onRefresh(params: QueryParameters) {
    this.currentParams = {...params};
    this.loadData();
  }

  onParamsInitialised = (params: QueryParameters) => { this.currentParams = {...params}; }

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

  onAdvancedSearch() {
    this.displayAdvancedSearch();
  }

  displayEditor(expense: Expense) {
    this.vrf.clear();
    const componentRef = this.vrf.createComponent(ExpensesEditorComponent);
    componentRef.instance.sidenavHost = this.sidenav;
    componentRef.instance.expense = expense;
    componentRef.instance.onSuccess = (_) => { this.loadData(); }
    this.sidenav.open()
  }

  displayAdvancedSearch() {
    const setup: AdvancedSearchSetup = {
      sidenavHost: this.sidenav,
      definitions: this.searchDefinition,
      applySearch: args => {
        console.log('Perform advanced search', args);
        this.conditions=args;
        this.sidenav.close();
      },
      clearSearch: () => this.conditions = null,
      conditionGroup: this.conditions
    };
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        {provide: ADVANCED_SEARCH_SETUP, useValue: setup}
      ]
    })

    this.vrf.clear();
    this.vrf.createComponent(AdvancedSearchComponent, {injector: injector});
    this.sidenav.open()
  }
}
