import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from '@features/expenses/services/expenses-store';
import { map, Observable } from 'rxjs';

@Injectable()
export class ExpensesApiClient {

  constructor(private httpClient: HttpClient) { }

  get(): Observable<Expense[]> {
    return this
      .httpClient
      .get('http://localhost:4100/expenses?pageNumber=1&pageSize=40&sorting=-enteredAt')
      // &conditions=description%7Cstarts%7Cbbb
      .pipe(
        map((resp: any) => {
          const rows = resp.rows;
          return resp.rows;
          // return rows.map((r: Expense) => <Expense> {
          //    id: r.id,
          //    rowVersion: r.rowVersion,
          //    description: r.description
          // });
        })
      );
  }
}
