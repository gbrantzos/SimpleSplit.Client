import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from "@features/expenses/components/categories/categories.component";
import { ExpensesListComponent } from "@features/expenses/components/expenses-list/expenses-list.component";
import { ExpensesComponent } from "@features/expenses/components/expenses/expenses.component";

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {
    path: 'list',
    component: ExpensesComponent
  },
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'list_v2',
    component: ExpensesListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesRoutingModule {}
