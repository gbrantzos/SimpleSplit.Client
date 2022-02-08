export interface PagedResult<T> {
  rows: T[];
  totalRows: number
  currentPage: number;
  pageSize: number;
}

export function emptyPagedResult<T>() {
  return {
    currentPage: 1,
    pageSize: 0,
    totalRows: 0,
    rows: []
  }
}
