import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "@environments/environment";
import { Expense } from '@features/expenses/services/expenses-store';
import { GenericApiClient } from "@shared/services/generic-api.client";

@Injectable()
export class ExpensesApiClient extends GenericApiClient<Expense> {
  constructor(httpClient: HttpClient) {
    super(`${environment.apiUrl}/expenses`, httpClient);
  }
}
