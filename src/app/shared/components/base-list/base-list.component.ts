import { Component, HostBinding, Injector, OnInit, SkipSelf, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";
import { ActivatedRoute } from "@angular/router";
import { AdvancedSearchComponent } from "@shared/components/advanced-search/advanced-search.component";
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
import { GenericStoreService, StoreState } from "@shared/services/generic-store.service";
import { LookupValuesResolver } from "@shared/services/lookup-values.resolver";
import { CriteriaDefinition, FormDefinition, ListDefinition, Schema } from "@shared/services/schema.models";
import { Observable } from "rxjs";

export interface BaseModel {
  id: number;
  rowVersion: number;
}

@Component({
  selector: 'smp-base-list',
  templateUrl: './base-list.component.html',
  styleUrls: ['./base-list.component.scss']
})
export class BaseListComponent<TEntity extends BaseModel> implements OnInit {
  @HostBinding('class') class = 'base-component';
  @ViewChild("sidenav") public sidenav: MatSidenav;
  @ViewChild("list") public list: GenericListComponent;
  @ViewChild('sidenavView', {read: ViewContainerRef}) vrf: ViewContainerRef;

  public state$: Observable<StoreState<TEntity>>;
  public currentParams: QueryParameters;

  public listDefinition: ListDefinition;
  public searchDefinition: CriteriaDefinition[];

  protected readonly editorDefinition: FormDefinition;
  protected advancedSearch: ConditionGroup = emptyConditionGroup();

  constructor(protected store: GenericStoreService<TEntity>,
              protected route: ActivatedRoute,
              protected lookupResolver: LookupValuesResolver,
              protected dialog: DialogService,
              @SkipSelf() protected injector: Injector) {
    this.state$ = this.store.items;

    const schema: Schema = this.route.snapshot.data.schema;
    this.listDefinition = schema.listDefinition;
    this.searchDefinition = schema.searchDefinition;
    this.editorDefinition = schema.editorDefinition;
  }

  ngOnInit(): void { }

  loadData() { this.store.load(this.currentParams, this.advancedSearch); }

  onRefresh(params: QueryParameters) {
    this.currentParams = {...params};
    this.loadData();
  }

  onParamsInitialised = (params: QueryParameters) => { this.currentParams = {...params}; }

  onParamsChanged(params: QueryParameters) {
    this.currentParams = {...params};
    this.loadData();
  }

  onTableClicked(entity: TEntity) { this.displayEditor({...entity}); }

  onAdvancedSearch() { this.displayAdvancedSearch(); }

  async displayEditor(entity: TEntity) {
    this.vrf.clear();
    const componentRef = this.vrf.createComponent(GenericEditorComponent);
    componentRef.instance.definition = await this.lookupResolver.resolveForm(this.editorDefinition);
    componentRef.instance.model = entity;
    componentRef.instance.allowDelete = !(entity.id == 0 && entity.rowVersion == 0);
    componentRef.instance.closeEvent = () => { this.sidenav.close(); }
    componentRef.instance.submitEvent = (model) => this.saveEntity(model);
    componentRef.instance.deleteEvent = (model) => this.deleteEntity(model);
    this.sidenav.open()
  }

  saveEntity = async (entity: TEntity) => {
    const message = await this.store.save(entity);

    if (message !== '') {
      console.warn(`Η αποθήκευση απέτυχε: ${message}`, entity);
      this.dialog.snackError(`Η αποθήκευση απέτυχε!\n${message}`);
      return;
    }

    this.dialog.snackSuccess('Η εγγραφή αποθηκεύτηκε!', 'Κλείσιμο');
    this.sidenav.close();
    this.loadData();
  }

  deleteEntity = async (entity: TEntity) => {
    if (await this.dialog.confirm('Πρόκειται να διαγράψετε την εγγραφή! Θέλετε να συνεχίσετε;') === false) {
      return;
    }

    const message = await this.store.delete(entity.id, entity.rowVersion);
    if (message !== '') {
      console.warn(`Η διαγραφή απέτυχε: ${message}`, entity);
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

  onNew() {
    throw new Error('You must provide implementation for \'onNew\' method!')
    // Create new entity and display editor
    // this.displayEditor();
  }
}
