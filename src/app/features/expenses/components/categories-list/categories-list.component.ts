import { ChangeDetectionStrategy, Component, HostBinding, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";
import { CategoriesEditorComponent } from "@features/expenses/components/categories-editor/categories-editor.component";
import { CategoriesStore, Category, CategoryKinds } from "@features/expenses/services/categories-store";
import { GenericListDefinition } from "@shared/components/generic-list/generic-list.component";
import { QueryParameters } from "@shared/models/query-parameters";
import { StoreState } from "@shared/services/generic-store.service";
import { Observable } from "rxjs";

@Component({
  selector: 'smp-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesListComponent implements OnInit {
  @HostBinding('class') class = 'base-component';
  @ViewChild("sidenav") public sidenav: MatSidenav;
  @ViewChild('sidenavView', {read: ViewContainerRef}) vrf: ViewContainerRef;

  public state$: Observable<StoreState<Category>>;
  public currentParams: QueryParameters;

  public listDefinition: GenericListDefinition = {
    name: 'CategoriesList',
    header: 'Κατηγορίες Εξόδων',
    storageKey: 'CategoriesList_QueryParameters',
    defaultPageSize: 10,
    pageSizes: [5, 10, 20],
    searchProperty: 'description',
    enableAdvancedSearch: false,
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
        name: 'kind',
        label: 'Ομάδα Εξόδων',
        class: 'kind',
        lookupValues: CategoryKinds
      }],
      displayedColumns: ['description', 'kind'],
      defaultSort: {
        column: 'description',
        direction: 'asc'
      },
    }
  }

  constructor(private categoriesStore: CategoriesStore) {
    this.state$ = this.categoriesStore.items;
  }

  ngOnInit(): void { }

  loadData() { this.categoriesStore.load(this.currentParams); }

  onRefresh(params: QueryParameters) {
    this.currentParams = {...params};
    this.loadData();
  }

  onNew = () => {
    this.displayEditor({
      id: 0,
      rowVersion: 0,
      description: 'Νέα κατηγορία εξόδων',
      kind: 0
    });
  }

  onTableClicked(category: Category) { this.displayEditor({...category}); }

  onParamsChanged(params: QueryParameters) {
    this.currentParams = {...params};
    this.loadData();
  }

  displayEditor(category: Category) {
    this.vrf.clear();
    const componentRef = this.vrf.createComponent(CategoriesEditorComponent);
    componentRef.instance.sidenavHost = this.sidenav;
    componentRef.instance.category = category;
    componentRef.instance.onSuccess = (_) => { this.loadData(); }
    this.sidenav.open()
  }
}
