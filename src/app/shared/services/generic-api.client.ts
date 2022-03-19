import { HttpClient, HttpParams } from "@angular/common/http";
import { ConditionGroup } from "@shared/components/advanced-search/advanced-search.models";
import { PagedResult } from "@shared/models/paged-result";
import { QueryParameters } from "@shared/models/query-parameters";
import { Observable } from "rxjs";

export abstract class GenericApiClient<T> {
  protected readonly apiUrl: string;

  protected constructor(apiUrl: string, protected httpClient: HttpClient) {
    this.apiUrl = apiUrl
  }

  public get(params: QueryParameters, advancedConditions: ConditionGroup): Observable<PagedResult<T>> {
    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber)
      .set('pageSize', params.pageSize)
      .set('sorting', params.sort.direction == 'asc' ? params.sort.column : `-${params.sort.column}`);

    if (advancedConditions.conditions.length !== 0) {
      return this
        .httpClient
        .post<PagedResult<T>>(`${this.apiUrl}/advanced-search`,
          advancedConditions, {
            params: httpParams
          });
    }

    for (let key in params.criteria) {
      const value = params.criteria[key];
      if (!!value) {
        httpParams = httpParams.append('conditions', `${key}|like|${value}`);
      }
    }

    return this
      .httpClient
      .get<PagedResult<T>>(this.apiUrl, {
        params: httpParams
      });
  }

  public save(entity: T): Observable<boolean> {
    return this.httpClient.post<boolean>(this.apiUrl, entity);
  }

  public delete(id: number, rowVersion: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(this.apiUrl, {
      body: {
        id: id,
        rowVersion: rowVersion
      }
    });
  }
}
