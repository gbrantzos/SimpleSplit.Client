﻿export interface QueryParameters {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  criteria?: string;
}

export interface SortInfo {
  column: string;
  direction: 'asc' | 'desc'
}
