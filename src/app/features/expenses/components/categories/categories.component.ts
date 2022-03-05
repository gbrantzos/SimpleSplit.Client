import { Component, HostBinding, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";
import { CategoriesEditorComponent } from "@features/expenses/components/categories-editor/categories-editor.component";
import { CategoriesStore, Category } from "@features/expenses/services/categories-store";
import { Observable } from "rxjs";
import { SubSink } from "subsink";

@Component({
  selector: 'smp-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'base-component';
  @ViewChild("sidenav") public sidenav: MatSidenav;
  @ViewChild('sidenavView', {read: ViewContainerRef}) vrf: ViewContainerRef;

  private subs = new SubSink();

  public errorMessage: string;
  public categories$: Observable<Category[]>;

  constructor(private categoriesStore: CategoriesStore) {
    this.categories$ = categoriesStore.categories;
    this.subs.sink = this.categoriesStore.errors.subscribe(err => this.errorMessage = err);
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }

  loadData = () => this.categoriesStore.load();

  private displayEditor(category: Category) {
    this.vrf.clear();
    const componentRef = this.vrf.createComponent(CategoriesEditorComponent);
    componentRef.instance.sidenavHost = this.sidenav;
    componentRef.instance.category = category;
    componentRef.instance.host = this;
    this.sidenav.open()
  }

  onRefresh = () => this.loadData();

  onNew = () => {
    this.displayEditor({
      id: 0,
      rowVersion: 0,
      description: 'Νέα κατηγορία εξόδων',
      kind: 0
    });
  }

  onCategoryClicked = (category: Category) => this.displayEditor({...category});
}
