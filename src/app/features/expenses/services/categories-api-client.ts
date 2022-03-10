import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { Category } from "@features/expenses/services/categories-store";
import { GenericApiClient } from "@shared/services/generic-api.client";

@Injectable()
export class CategoriesApiClient extends GenericApiClient<Category> {
  constructor(httpClient: HttpClient) {
    super(`${environment.apiUrl}/categories`, httpClient);
  }
}
