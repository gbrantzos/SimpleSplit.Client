export interface QueryParameters {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo
}

export interface SortInfo {
  column: string;
  direction: 'asc' | 'desc'
}
