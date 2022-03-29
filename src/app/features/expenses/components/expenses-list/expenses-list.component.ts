import { Component, HostBinding, Injector, OnInit, SkipSelf, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";
import { ActivatedRoute } from "@angular/router";
import { Expense, ExpensesStore } from "@features/expenses/services/expenses-store";
import { AdvancedSearchComponent } from '@shared/components/advanced-search/advanced-search.component';
import {
  ADVANCED_SEARCH_SETUP,
  AdvancedSearchSetup,
  ConditionGroup,
  emptyConditionGroup
} from "@shared/components/advanced-search/advanced-search.models";
import { GenericEditorComponent } from "@shared/components/generic-editor/generic-editor.component";
import { GenericListComponent } from "@shared/components/generic-list/generic-list.component";
import { QueryParameters } from "@shared/models/query-parameters";
import { DialogService } from "@shared/services/dialog.service";
import { StoreState } from "@shared/services/generic-store.service";
import { LookupValuesResolver } from "@shared/services/lookup-values.resolver";
import { CriteriaDefinition, FormDefinition, GenericListDefinition, Schema } from "@shared/services/schema.models";
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

  private readonly editorDefinition: FormDefinition;
  private advancedSearch: ConditionGroup = emptyConditionGroup();

  constructor(private expensesStore: ExpensesStore,
              private route: ActivatedRoute,
              private lookupResolver: LookupValuesResolver,
              private dialog: DialogService,
              @SkipSelf() private injector: Injector) {
    this.state$ = this.expensesStore.items;

    const schema: Schema = this.route.snapshot.data.schema;
    this.listDefinition = schema.listDefinition;
    this.searchDefinition = schema.searchDefinition;
    this.editorDefinition = {
      name: 'expense-editor',
      label: 'Στοιχεία Εξόδου',
      items: [
        {name: 'description', label: 'Περιγραφή', type: "text", flex: '100', validators: [{name: "required"}]},
        {
          name: 'categoryId',
          label: 'Κατηγορια',
          type: "select",
          flex: '100',
          lookupName: "EXPENSES::CATEGORIES",
          lookupDynamic: true,
          isNumber: true
        },
        {name: 'enteredAt', label: 'Ημερομηνία', type: "date", flex: '50'},
        {
          name: 'amount',
          label: 'Αξια',
          type: "number",
          flex: '50',
          class: 'align-right',
          suffixIcon: 'fas fa-euro-sign',
          validators: [{name: "required"}, {name: "min", parameters: 0}]
        },
        {name: 'isOwnerCharge', label: 'Επιβάρυνση ιδιοκτήτη', type: "checkbox", flex: '100'},
      ]
    };
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

  async displayEditor(expense: Expense) {
    this.vrf.clear();
    const componentRef = this.vrf.createComponent(GenericEditorComponent);
    componentRef.instance.definition = await this.lookupResolver.resolveForm(this.editorDefinition);
    componentRef.instance.model = expense;
    componentRef.instance.allowDelete = !(expense.id == 0 && expense.rowVersion == 0);
    componentRef.instance.closeEvent = () => { this.sidenav.close(); }
    componentRef.instance.submitEvent = (model) => this.saveExpense(model);
    componentRef.instance.deleteEvent = (model) => this.deleteExpense(model);
    this.sidenav.open()
  }

  saveExpense = async (expense: Expense) => {
    const message = await this.expensesStore.save(expense);

    if (message !== '') {
      console.warn(`Η αποθήκευση απέτυχε: ${message}`, expense);
      this.dialog.snackError(`Η αποθήκευση απέτυχε!\n${message}`);
      return;
    }

    this.dialog.snackSuccess('Η εγγραφή αποθηκεύτηκε!', 'Κλείσιμο');
    this.sidenav.close();
    this.loadData();
  }

  deleteExpense = async (expense: Expense) => {
    if (await this.dialog.confirm('Πρόκειται να διαγράψετε την εγγραφή! Θέλετε να συνεχίσετε;') === false) {
      return;
    }

    const message = await this.expensesStore.delete(expense.id, expense.rowVersion);
    if (message !== '') {
      console.warn(`Η διαγραφή απέτυχε: ${message}`, expense);
      this.dialog.snackError(`Η διαγραφή απέτυχε!\n${message}`);
      return;
    }

    this.dialog.snackSuccess('Η εγγραφή διαγράφηκε!', 'Κλείσιμο')
    this.sidenav.close();
    this.loadData();
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
