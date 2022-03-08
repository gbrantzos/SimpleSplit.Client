export interface PagedResult<T> {
  rows: T[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRows: number;
}

export function createEmptyPagedResult<T>() {
  return {
    currentPage: 1,
    pageSize: -1,
    totalPages: 1,
    totalRows: 0,
    rows: []
  }
}
