import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from '@features/expenses/services/expenses-store';
import { map, Observable } from 'rxjs';
import { PagedResult } from "@shared/models/paged-result";
import { QueryParameters } from "@shared/models/query-parameters";

@Injectable()
export class ExpensesApiClient {
  private apiUrl = "http://localhost:4100"

  constructor(private httpClient: HttpClient) { }

  get(params: QueryParameters): Observable<PagedResult<Expense>> {
    const url = `${this.apiUrl}/expenses`;
    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber)
      .set('pageSize', params.pageSize)
      .set('sorting', params.sort.direction == 'asc' ? params.sort.column : `-${params.sort.column}`);
    if (!!params.criteria) {
      httpParams = httpParams.append('conditions', `description|like|${params.criteria}`)
    }
    return this
      .httpClient
      .get<PagedResult<Expense>>(url, {
        params: httpParams
      });
  }
}
