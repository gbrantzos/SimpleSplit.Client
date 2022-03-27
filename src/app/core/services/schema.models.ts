import { SortInfo } from "@shared/models/query-parameters";
import { Observable } from "rxjs";

export interface Schema {
  listDefinition: GenericListDefinition,
  searchDefinition: CriteriaDefinition[]
}

export interface GenericListDefinition {
  name: string;
  header: string;
  storageKey: string;
  defaultPageSize: number;
  pageSizes: number[];
  searchProperty: string;
  enableAdvancedSearch: boolean;
  tableDefinition: GenericTableDefinition
}

export interface GenericTableDefinition {
  availableColumns: ColumnDefinition [];
  displayedColumns: string[];
  defaultSort: SortInfo;
}

export interface ColumnDefinition {
  name: string;
  label?: string;
  class?: string;
  labelClass?: string;
  sortProperty?: string;
  arrowPosition?: 'before' | 'after';
  enableClickEvent?: boolean;
  dateFormat?: string;
  numericFormat?: string;
  suffix?: string;
  lookupName?: string;
  lookupValues?: {
    [key: string]: string
  }
}

export interface CriteriaDefinition {
  property: string;
  label: string;
  input: 'text' | 'select' | 'date' | 'checkbox';
  multi?: boolean;
  lookupName?: string;
  lookupValues?: {
    [key: string]: string
  },
  lookupValuesAsync?: Observable<{ key: string, label: string }>
}

export interface Lookup {
  name: string;
  items: LookupItems;
  cacheable: boolean;
}

export interface LookupItems {
  [key: string]: string | any
}



export const defaultDefinition: GenericListDefinition = {
  name: '_Generic_List_',
  header: 'Generic List',
  storageKey: '__GenericList_Params__',
  defaultPageSize: 10,
  pageSizes: [5, 10, 20],
  searchProperty: '__',
  enableAdvancedSearch: false,
  tableDefinition: {
    availableColumns: [],
    displayedColumns: [],
    defaultSort: {
      column: '__',
      direction: "asc"
    }
  }
};

