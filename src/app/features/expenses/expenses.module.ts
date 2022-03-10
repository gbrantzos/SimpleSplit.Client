import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CategoriesComponent } from "@features/expenses/components/categories/categories.component";
import { ExpensesEditorComponent } from "@features/expenses/components/expenses-editor/expenses-editor.component";
import { ExpensesTableComponent } from '@features/expenses/components/expenses-table/expenses-table.component';
import { ExpensesComponent } from "@features/expenses/components/expenses/expenses.component";
import { ExpensesRoutingModule } from '@features/expenses/expenses-routing.module';
import { CategoriesApiClient } from "@features/expenses/services/categories-api-client";
import { CategoriesStore } from "@features/expenses/services/categories-store";
import { ExpensesApiClient } from '@features/expenses/services/expenses-api-client';
import { ExpensesStore } from '@features/expenses/services/expenses-store';
import { SharedModule } from "@shared/shared.module";
import { CategoriesEditorComponent } from './components/categories-editor/categories-editor.component';
import { CategoriesTableComponent } from './components/categories-table/categories-table.component';
import { ExpensesListComponent } from './components/expenses-list/expenses-list.component';

@NgModule({
  declarations: [
    ExpensesComponent,
    ExpensesTableComponent,
    ExpensesEditorComponent,
    CategoriesComponent,
    CategoriesTableComponent,
    CategoriesEditorComponent,
    ExpensesListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ExpensesRoutingModule
  ],
  providers: [
    ExpensesStore,
    ExpensesApiClient,
    CategoriesStore,
    CategoriesApiClient
  ]
})
export class ExpensesModule {

}
