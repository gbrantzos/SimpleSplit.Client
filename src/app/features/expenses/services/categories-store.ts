import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CategoriesApiClient } from "@features/expenses/services/categories-api-client";
import { EmptyConditionGroup } from "@shared/components/advanced-search/advanced-search.models";
import { DefaultQueryParameters } from "@shared/models/query-parameters";
import { GenericStoreService } from "@shared/services/generic-store.service";
import { map, Observable } from "rxjs";

export interface Category {
  id: number;
  rowVersion: number;
  description: string;
  kind: number;
}

export const CategoryKinds: { [key: string]: string } = {
  '1': 'Θερμανση',
  '2': 'Ανελκυστήρας',
  '3': 'Λοιπά'
};

@Injectable()
export class CategoriesStore extends GenericStoreService<Category> {
  constructor(httpClient: HttpClient, private client: CategoriesApiClient) { super(client); }

  get categories(): Observable<any> {
    return this
      .client
      .get(DefaultQueryParameters, EmptyConditionGroup)
      .pipe(
        map(result => result
          .rows
          .map(c => {
            return {
              key: c.id,
              value: c.description
            }
          })
          .sort((a, b) => a.value.localeCompare(b.value))
        )
      );
  }
}
