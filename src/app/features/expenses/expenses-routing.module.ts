import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesListComponent } from "@features/expenses/components/categories-list/categories-list.component";
import { ExpensesListComponent } from "@features/expenses/components/expenses-list/expenses-list.component";

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {
    path: 'list',
    component: ExpensesListComponent
  },
  {
    path: 'categories',
    component: CategoriesListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesRoutingModule {}
