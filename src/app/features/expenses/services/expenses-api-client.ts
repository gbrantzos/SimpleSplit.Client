import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from '@features/expenses/services/expenses-store';
import { map, Observable } from 'rxjs';
import { PagedResult } from "@shared/models/paged-result";
import { QueryParameters } from "@shared/models/query-parameters";
import { environment } from "@environments/environment";

@Injectable()
export class ExpensesApiClient {
  private readonly apiUrl: string;

  constructor(private httpClient: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  public get(params: QueryParameters): Observable<PagedResult<Expense>> {
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

  public save(expense: Expense): Observable<boolean> {
    const url = `${this.apiUrl}/expenses`;
    return this.httpClient.post<boolean>(url, expense);
  }

  public delete(id: number, rowVersion: number): Observable<boolean> {
    const url = `${this.apiUrl}/expenses`;
    return this.httpClient.delete<boolean>(url, {
      body: {
        id: id,
        rowVersion: rowVersion
      }
    });
  }
}
