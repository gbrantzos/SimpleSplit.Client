import { Injectable } from '@angular/core';
import { ExpensesApiClient } from '@features/expenses/services/expenses-api-client';
import { BehaviorSubject, throwError } from 'rxjs';

@Injectable()
export class ExpensesStore {
  private readonly expenses$ = new BehaviorSubject<Expense[]>([]);
  private readonly errors$ = new BehaviorSubject<string>('');
  private readonly loading$ = new BehaviorSubject<boolean>(false);

  public readonly expenses = this.expenses$.asObservable();
  public readonly errors = this.errors$.asObservable();
  public readonly loading = this.loading$.asObservable();

  constructor(private apiClient: ExpensesApiClient) { }

  load = () => {
    this.loading$.next(true);
    this.expenses$.next([]);
    this.apiClient.get()
      .subscribe({
        next: exp => {
          this.loading$.next(false);
          this.expenses$.next(exp);
        },
        error: err => {console.warn(err)
          this.errors$.next(err);
          this.loading$.next(false);
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
