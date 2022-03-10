import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CategoriesEditorComponent } from "@features/expenses/components/categories-editor/categories-editor.component";
import { ExpensesEditorComponent } from "@features/expenses/components/expenses-editor/expenses-editor.component";
import { ExpensesListComponent } from "@features/expenses/components/expenses-list/expenses-list.component";
import { ExpensesRoutingModule } from '@features/expenses/expenses-routing.module';
import { CategoriesApiClient } from "@features/expenses/services/categories-api-client";
import { CategoriesStore } from "@features/expenses/services/categories-store";
import { ExpensesApiClient } from '@features/expenses/services/expenses-api-client';
import { ExpensesStore } from '@features/expenses/services/expenses-store';
import { SharedModule } from "@shared/shared.module";
import { CategoriesListComponent } from './components/categories-list/categories-list.component';

@NgModule({
  declarations: [
    ExpensesListComponent,
    ExpensesEditorComponent,
    CategoriesListComponent,
    CategoriesEditorComponent,
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
export class ExpensesModule {}
