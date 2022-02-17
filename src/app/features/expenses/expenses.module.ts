import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpensesRoutingModule } from '@features/expenses/expenses-routing.module';
import { ExpensesComponent } from '@features/expenses/expenses.component';
import { ExpensesStore } from '@features/expenses/services/expenses-store';
import { ExpensesApiClient } from '@features/expenses/services/expenses-api-client';
import { SharedModule } from "@shared/shared.module";
import { ExpensesTableComponent } from '@features/expenses/components/expenses-table/expenses-table.component';
import { ExpensesEditorComponent } from "@features/expenses/components/expenses-editor/expenses-editor.component";

@NgModule({
  declarations: [
    ExpensesComponent,
    ExpensesTableComponent,
    ExpensesEditorComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ExpensesRoutingModule
  ],
  providers: [
    ExpensesStore,
    ExpensesApiClient
  ]
})
export class ExpensesModule {
}
