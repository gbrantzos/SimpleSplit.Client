import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "@environments/environment";
import { Expense } from '@features/expenses/services/expenses-store';
import { GenericApiClient } from "@shared/services/generic-api.client";
import { Observable } from "rxjs";

@Injectable()
export class ExpensesApiClient extends GenericApiClient<Expense> {
  constructor(httpClient: HttpClient) {
    super(`${environment.apiUrl}/expenses`, httpClient);
  }

  public updateCategory(expenses: Expense[], categoryId: number): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.apiUrl}/update-category`, {
      expenses,
      categoryId
    });
  }
}
