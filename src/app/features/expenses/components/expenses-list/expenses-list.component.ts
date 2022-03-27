import { Component, HostBinding, Injector, OnInit, SkipSelf, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";
import { ActivatedRoute } from "@angular/router";
import { CriteriaDefinition, GenericListDefinition, Schema } from "@core/services/schema.models";
import { ExpensesEditorComponent } from "@features/expenses/components/expenses-editor/expenses-editor.component";
import { CategoriesStore } from "@features/expenses/services/categories-store";
import { Expense, ExpensesStore } from "@features/expenses/services/expenses-store";
import { AdvancedSearchComponent } from '@shared/components/advanced-search/advanced-search.component';
import {
  ADVANCED_SEARCH_SETUP,
  AdvancedSearchSetup,
  ConditionGroup,
  emptyConditionGroup
} from "@shared/components/advanced-search/advanced-search.models";
import { GenericListComponent } from "@shared/components/generic-list/generic-list.component";
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
  @ViewChild("list") public list: GenericListComponent;
  @ViewChild('sidenavView', {read: ViewContainerRef}) vrf: ViewContainerRef;

  public state$: Observable<StoreState<Expense>>;
  public currentParams: QueryParameters;

  public listDefinition: GenericListDefinition;
  public searchDefinition: CriteriaDefinition[];

  private advancedSearch: ConditionGroup = emptyConditionGroup();

  constructor(private expensesStore: ExpensesStore,
              private categoriesStore: CategoriesStore,
              private route: ActivatedRoute,
              @SkipSelf() private injector: Injector) {
    this.state$ = this.expensesStore.items;

    const schema: Schema = this.route.snapshot.data.schema;
    this.listDefinition = schema.listDefinition;
    this.searchDefinition = schema.searchDefinition;
  }

  ngOnInit(): void { }

  loadData() { this.expensesStore.load(this.currentParams, this.advancedSearch); }

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

  onAdvancedSearch() { this.displayAdvancedSearch(); }

  displayEditor(expense: Expense) {
    this.vrf.clear();
    const componentRef = this.vrf.createComponent(ExpensesEditorComponent);
    componentRef.instance.sidenavHost = this.sidenav;
    componentRef.instance.expense = expense;
    componentRef.instance.onSuccess = (_) => { this.loadData(); }
    this.sidenav.open()
  }

  displayAdvancedSearch() {
    if (!!this.currentParams.criteria && (!this.advancedSearch || this.advancedSearch.conditions.length == 0)) {
      this.advancedSearch = emptyConditionGroup();
      Object.keys(this.currentParams.criteria).forEach(key => {
        const value = this.currentParams.criteria[key];
        if (!!value) {
          this.advancedSearch.grouping = "or";
          this.advancedSearch.conditions.push({
            property: key,
            operator: 'starts',
            value: value
          });
        }
      });
      this.currentParams.criteria = null;
    }

    const setup: AdvancedSearchSetup = {
      sidenavHost: this.sidenav,
      definitions: this.searchDefinition,
      applySearch: args => {
        this.list.onClearSearch(true);
        this.advancedSearch = args;
        this.loadData();
        this.sidenav.close();
      },
      clearSearch: () => {
        this.advancedSearch = emptyConditionGroup();
        this.loadData();
      },
      conditionGroup: this.advancedSearch
    };

    const injector = Injector.create({
      parent: this.injector,
      providers: [{provide: ADVANCED_SEARCH_SETUP, useValue: setup}]
    })

    this.vrf.clear();
    this.vrf.createComponent(AdvancedSearchComponent, {injector});
    this.sidenav.open()
  }
}
