import { HttpClient, HttpParams } from "@angular/common/http";
import { PagedResult } from "@shared/models/paged-result";
import { QueryParameters } from "@shared/models/query-parameters";
import { Observable } from "rxjs";

export abstract class GenericApiClient<T> {
  protected readonly apiUrl: string;

  protected constructor(apiUrl: string, protected httpClient: HttpClient) {
    this.apiUrl = apiUrl
  }

  public get(params: QueryParameters): Observable<PagedResult<T>> {
    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber)
      .set('pageSize', params.pageSize)
      .set('sorting', params.sort.direction == 'asc' ? params.sort.column : `-${params.sort.column}`);
    if (!!params.criteria) {
      httpParams = httpParams.append('conditions', `description|like|${params.criteria}`)
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
