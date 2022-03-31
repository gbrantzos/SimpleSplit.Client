import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { ExpensesApiClient } from '@features/expenses/services/expenses-api-client';
import { BaseModel } from "@shared/components/base-list/base-list.component";
import { GenericStoreService } from "@shared/services/generic-store.service";

export interface Expense extends BaseModel{
  description: string;
  enteredAt: Date;
  amount: number;
  category?: string;
  categoryId?: number;
  isOwnerCharge: boolean;
  sharedAt?: string
}

@Injectable()
export class ExpensesStore extends GenericStoreService<Expense> {
  constructor(httpClient: HttpClient, client: ExpensesApiClient) { super(client); }
}
