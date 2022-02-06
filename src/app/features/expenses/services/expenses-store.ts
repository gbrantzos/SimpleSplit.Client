import { Injectable } from '@angular/core';
import { ExpensesApiClient } from '@features/expenses/services/expenses-api-client';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ExpensesStore {
  private readonly expenses$ = new BehaviorSubject<Expense[]>([]);
  public readonly expenses = this.expenses$.asObservable();

  constructor(private apiClient: ExpensesApiClient) { }

  load = () => {
    const call$ = this.apiClient.get()
      .subscribe({
        next: exp => {
          this.expenses$.next(exp);
        },
        error: err => {
          console.error(err);
          this.expenses$.next([]);
        }
      });
  }
}

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
