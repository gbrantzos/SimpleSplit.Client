import { createEmptyPagedResult, PagedResult } from "@shared/models/paged-result";
import { QueryParameters } from "@shared/models/query-parameters";
import { GenericApiClient } from "@shared/services/generic-api.client";
import { BehaviorSubject, catchError, firstValueFrom, map, of, Subscription } from "rxjs";

export enum CallState {
  Initial = 'INITIAL',
  Pending = 'PENDING',
  Finished = 'FINISHED',
  Failed = 'FAILED',
  NoData = 'NODATA'
}

export interface StoreState<T> {
  result: PagedResult<T>;
  callState: CallState;
  errorMessage: string | null;
}

export abstract class GenericStoreService<T> {
  private apiCall$: Subscription;
  protected readonly state$ = new BehaviorSubject<StoreState<T>>(this.emptyState());
  public readonly expenses = this.state$.asObservable();

  protected constructor(private apiClient: GenericApiClient<T>) { }

  public load(params: QueryParameters) {
    if (this.apiCall$ && !this.apiCall$.closed) {
      this.apiCall$.unsubscribe();
    }

    this.state$.next({
      result: createEmptyPagedResult<T>(),
      callState: CallState.Pending,
      errorMessage: null
    })

    this.apiCall$ = this.apiClient.get(params)
      .subscribe({
        next: response => {
          this.state$.next({
            result: response,
            callState: !!response.rows.length ? CallState.Finished : CallState.NoData,
            errorMessage: null
          })
        },
        error: errorMessage => {
          console.warn(errorMessage);
          this.state$.next({
            ...this.state$.getValue(),
            callState: CallState.Failed,
            errorMessage: errorMessage
          });
        }
      });
  }

  public save(entity: T): Promise<string> {
    const apiCall$ = this.apiClient
      .save(entity)
      .pipe(
        map(res => ''),
        catchError(err => {
          return of(err)
        })
      );
    return firstValueFrom(apiCall$);
  }

  public delete(id: number, rowVersion: number): Promise<string> {
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

  protected emptyState(): StoreState<T> {
    return {
      result: createEmptyPagedResult<T>(),
      callState: CallState.Pending,
      errorMessage: null
    };
  }
}
