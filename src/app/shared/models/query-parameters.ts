import { SortInfo } from "@shared/services/schema.models";

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
