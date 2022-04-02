import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { ExpensesApiClient } from '@features/expenses/services/expenses-api-client';
import { BaseModel } from "@shared/components/base-list/base-list.component";
import { GenericStoreService } from "@shared/services/generic-store.service";
import { catchError, firstValueFrom, map, Observable, of } from "rxjs";

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
  constructor(httpClient: HttpClient, private client: ExpensesApiClient) { super(client); }

  public updateCategory(expenses: Expense[], categoryId: number): Promise<string> {
    const apiCall$ = this.client
      .updateCategory(expenses, categoryId)
      .pipe(
        map(res => ''),
        catchError(err => {
          return of(err)
        })
      );
    return firstValueFrom(apiCall$);
  }
}
