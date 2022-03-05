import { Injectable } from "@angular/core";
import { CategoriesApiClient } from "@features/expenses/services/categories-api-client";
import { BehaviorSubject, catchError, firstValueFrom, map, of, Subscription } from "rxjs";

export interface Category {
  id: number;
  rowVersion: number;
  description: string;
  kind: number;
}

@Injectable()
export class CategoriesStore {
  private readonly categories$ = new BehaviorSubject<Category[]>([]);
  private readonly errors$ = new BehaviorSubject<string>('');
  private apiCall$: Subscription;

  public readonly categories = this.categories$.asObservable();
  public readonly errors = this.errors$.asObservable();

  constructor(private apiClient: CategoriesApiClient) { }

  public load() {
    if (this.apiCall$ && !this.apiCall$.closed) {
      this.apiCall$.unsubscribe();
    }
    this.errors$.next('');
    this.categories$.next([]);

    this.apiCall$ = this.apiClient.get()
      .subscribe({
        next: ctgs => {
          this.categories$.next(ctgs.rows);
        },
        error: err => {
          console.warn(err)
          this.errors$.next(err);
          this.categories$.next([]);
        }
      });
  }

  public save = (category: Category): Promise<string> => {
    const apiCall$ = this.apiClient
      .save(category)
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
