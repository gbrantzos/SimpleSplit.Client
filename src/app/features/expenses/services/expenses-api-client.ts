import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from '@features/expenses/services/expenses-store';
import { map, Observable } from 'rxjs';
import { PagedResult } from "@shared/models/paged-result";

@Injectable()
export class ExpensesApiClient {

  constructor(private httpClient: HttpClient) { }

  get(): Observable<PagedResult<Expense>> {
    return this
      .httpClient
      .get<PagedResult<Expense>>('http://localhost:4100/expenses?pageNumber=3&pageSize=20&sorting=-enteredAt');
      // &conditions=description%7Cstarts%7Cbbb

  }
}
