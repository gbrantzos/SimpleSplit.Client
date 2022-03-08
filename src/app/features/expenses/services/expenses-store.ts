import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { ExpensesApiClient } from '@features/expenses/services/expenses-api-client';
import { GenericStoreService } from "@shared/services/generic-store.service";

export interface Expense {
  id: number;
  rowVersion: number;
  description: string;
  enteredAt: Date;
  amount: number;
  category?: string;
  isOwnerCharge: boolean;
  sharedAt?: string
}

@Injectable()
export class ExpensesStore extends GenericStoreService<Expense> {
  constructor(httpClient: HttpClient, client: ExpensesApiClient) { super(client); }
}
