import { HttpClient } from '@angular/common/http';
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
    let url = `${this.apiUrl}/expenses?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}`;
    url = url + '&sorting=-enteredAt';
    return this
      .httpClient
      .get<PagedResult<Expense>>(url);
    // &conditions=description%7Cstarts%7Cbbb

  }
}
