export interface QueryParameters {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  criteria?: {
    [property: string]: string
  };
}

export const DefaultQueryParameters: QueryParameters = {
  pageNumber: 1,
  pageSize: 0,
  sort: {
    column: 'description',
    direction: "asc"
  }
}


export interface SortInfo {
  column: string;
  direction: 'asc' | 'desc'
}
