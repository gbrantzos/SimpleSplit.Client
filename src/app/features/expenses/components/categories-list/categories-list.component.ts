import { ChangeDetectionStrategy, Component, HostBinding, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";
import { ActivatedRoute } from "@angular/router";
import { CategoriesStore, Category } from "@features/expenses/services/categories-store";
import { emptyConditionGroup } from "@shared/components/advanced-search/advanced-search.models";
import { GenericEditorComponent } from "@shared/components/generic-editor/generic-editor.component";
import { QueryParameters } from "@shared/models/query-parameters";
import { DialogService } from "@shared/services/dialog.service";
import { StoreState } from "@shared/services/generic-store.service";
import { LookupValuesResolver } from "@shared/services/lookup-values.resolver";
import { FormDefinition, ListDefinition, Schema } from "@shared/services/schema.models";
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

  public listDefinition: ListDefinition;
  private readonly editorDefinition: FormDefinition;

  constructor(private categoriesStore: CategoriesStore,
              private lookupResolver: LookupValuesResolver,
              private dialog: DialogService,
              private route: ActivatedRoute) {
    this.state$ = this.categoriesStore.items;

    const schema: Schema = this.route.snapshot.data.schema;
    this.listDefinition = schema.listDefinition;
    this.editorDefinition = schema.editorDefinition;
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

  async displayEditor(category: Category) {
    const editorDefinition = await this.lookupResolver.resolveForm(this.editorDefinition);
    this.vrf.clear();
    const componentRef = this.vrf.createComponent(GenericEditorComponent);
    componentRef.instance.definition = editorDefinition;
    componentRef.instance.model = category;
    componentRef.instance.allowDelete = !(category.id == 0 && category.rowVersion == 0);
    componentRef.instance.closeEvent = () => { this.sidenav.close(); }
    componentRef.instance.submitEvent = (model) => this.saveCategory(model);
    componentRef.instance.deleteEvent = (model) => this.deleteCategory(model);
    this.sidenav.open()
  }

  saveCategory = async (category: Category) => {
    const message = await this.categoriesStore.save(category);

    if (message !== '') {
      console.warn(`Η αποθήκευση απέτυχε: ${message}`, category);
      this.dialog.snackError(`Η αποθήκευση απέτυχε!\n${message}`);
      return;
    }

    this.dialog.snackSuccess('Η εγγραφή αποθηκεύτηκε!', 'Κλείσιμο');
    this.sidenav.close();
    this.loadData();
  }

  deleteCategory = async (category: Category) => {
    if (await this.dialog.confirm('Πρόκειται να διαγράψετε την εγγραφή! Θέλετε να συνεχίσετε;') === false) {
      return;
    }

    const message = await this.categoriesStore.delete(category.id, category.rowVersion);
    if (message !== '') {
      console.warn(`Η διαγραφή απέτυχε: ${message}`, category);
      this.dialog.snackError(`Η διαγραφή απέτυχε!\n${message}`);
      return;
    }

    this.dialog.snackSuccess('Η εγγραφή διαγράφηκε!', 'Κλείσιμο')
    this.sidenav.close();
    this.loadData();
  }
}
