import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CategoriesApiClient } from "@features/expenses/services/categories-api-client";
import { GenericStoreService } from "@shared/services/generic-store.service";

export interface Category {
  id: number;
  rowVersion: number;
  description: string;
  kind: number;
}

@Injectable()
export class CategoriesStore extends GenericStoreService<Category> {
  constructor(httpClient: HttpClient, client: CategoriesApiClient) { super(client); }
}
