import { ChangeDetectionStrategy, Component, HostBinding, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";
import { ActivatedRoute } from "@angular/router";
import { GenericListDefinition, Schema } from "@core/services/schema.models";
import { CategoriesEditorComponent } from "@features/expenses/components/categories-editor/categories-editor.component";
import { CategoriesStore, Category } from "@features/expenses/services/categories-store";
import { emptyConditionGroup } from "@shared/components/advanced-search/advanced-search.models";
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

  public listDefinition: GenericListDefinition;

  constructor(private categoriesStore: CategoriesStore,
              private route: ActivatedRoute) {
    this.state$ = this.categoriesStore.items;

    const schema: Schema = this.route.snapshot.data.schema;
    this.listDefinition = schema.listDefinition;
  }

  ngOnInit(): void { }

  loadData() { this.categoriesStore.load(this.currentParams, emptyConditionGroup()); }

  onParamsInitialised = (params: QueryParameters) => { this.currentParams = {...params}; }

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
