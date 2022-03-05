import { Injectable } from '@angular/core';
import { ExpensesApiClient } from '@features/expenses/services/expenses-api-client';
import { BehaviorSubject, catchError, firstValueFrom, map, of, Subscription } from 'rxjs';
import { emptyPagedResult, PagedResult } from "@shared/models/paged-result";
import { QueryParameters } from "@shared/models/query-parameters";

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
export class ExpensesStore {
  private static readonly Empty = emptyPagedResult<Expense>();

  private readonly expenses$ = new BehaviorSubject<PagedResult<Expense>>(ExpensesStore.Empty);
  private readonly errors$ = new BehaviorSubject<string>('');
  private readonly loading$ = new BehaviorSubject<boolean>(false);
  private apiCall$: Subscription;

  public readonly expenses = this.expenses$.asObservable();
  public readonly errors = this.errors$.asObservable();
  public readonly loading = this.loading$.asObservable();

  constructor(private apiClient: ExpensesApiClient) { }

  public load = (params: QueryParameters) => {
    if (this.apiCall$ && !this.apiCall$.closed) {
      this.apiCall$.unsubscribe();
    }
    this.loading$.next(true);
    this.errors$.next('');
    this.expenses$.next(ExpensesStore.Empty);

    this.apiCall$ = this.apiClient.get(params)
      .subscribe({
        next: exp => {
          this.loading$.next(false);
          this.expenses$.next(exp);
        },
        error: err => {
          console.warn(err)
          this.errors$.next(err);
          this.loading$.next(false);
          this.expenses$.next(ExpensesStore.Empty);
        }
      });
  }

  public save = (expense: Expense): Promise<string> => {
    const apiCall$ = this.apiClient
      .save(expense)
      .pipe(
        map(res => ''),
        catchError(err => {
          return of(err)
        })
      );
    return firstValueFrom(apiCall$);
  }

  public delete = (id: number, rowVersion: number): Promise<string> => {
    const apiCall$ = this.apiClient
      .delete(id, rowVersion)
      .pipe(
        map(res => ''),
        catchError(err => {
          return of(err)
        })
      );
    return firstValueFrom(apiCall$);
  }

}

