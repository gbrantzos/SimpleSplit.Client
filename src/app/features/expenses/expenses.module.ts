import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExpensesListComponent } from "@features/expenses/components/expenses-list/expenses-list.component";
import { ExpensesRoutingModule } from '@features/expenses/expenses-routing.module';
import { CategoriesApiClient } from "@features/expenses/services/categories-api-client";
import { CategoriesStore } from "@features/expenses/services/categories-store";
import { ExpensesApiClient } from '@features/expenses/services/expenses-api-client';
import { ExpensesStore } from '@features/expenses/services/expenses-store';
import { LookupService } from "@shared/services/lookup.service";
import { SharedModule } from "@shared/shared.module";
import { map, of } from "rxjs";
import { CategoriesListComponent } from './components/categories-list/categories-list.component';
import { SelectCategoryComponent } from './components/select-category/select-category.component';

@NgModule({
  declarations: [
    ExpensesListComponent,
    CategoriesListComponent,
    SelectCategoryComponent,
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
  constructor(lookupService: LookupService, categoriesStore: CategoriesStore) {

    lookupService.registerLookup('EXPENSES::CATEGORIES_KINDS', true, () => {
      return of(new Map<string, string>([
        ['2', 'Ανελκυστήρας'],
        ['1', 'Θερμανση'],
        ['3', 'Λοιπά']
      ]))
    });

    lookupService.registerLookup('EXPENSES::CATEGORIES', true, () => {
      return categoriesStore
        .categories
        .pipe(
          map((ctg: any[]) => {
            const result = new Map<string, string>();
            ctg.forEach(c => result.set(c.key, c.value));
            return result;
          })
        );
    });

  }
}
