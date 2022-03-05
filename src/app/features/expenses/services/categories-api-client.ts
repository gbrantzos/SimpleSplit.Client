import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { Category } from "@features/expenses/services/categories-store";
import { PagedResult } from "@shared/models/paged-result";
import { Observable } from "rxjs";

@Injectable()
export class CategoriesApiClient {
  private readonly apiUrl: string;
  private readonly baseUrl: string

  constructor(private httpClient: HttpClient) {
    this.apiUrl = environment.apiUrl;
    this.baseUrl = `${this.apiUrl}/categories`;
  }

  public get(): Observable<PagedResult<Category>> {
    return this
      .httpClient
      .get<PagedResult<Category>>(this.baseUrl);
  }

  public save(category: Category): Observable<boolean> {
    return this.httpClient.post<boolean>(this.baseUrl, category);
  }

  public delete(id: number, rowVersion: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(this.baseUrl, {
      body: {
        id: id,
        rowVersion: rowVersion
      }
    });
  }

}
