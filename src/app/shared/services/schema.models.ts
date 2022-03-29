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

export interface FormDefinition {
  name: string;
  label: string;
  class?: string | string [];
  width?: string;
  items: FormItem[];
}

export interface FormItem {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'date' | 'checkbox';
  isNumber?: boolean;
  class?: string;
  flex?: string;
  lookupName?: string;
  lookupValues?: {
    [key: string]: string
  };
  multi?: boolean;
  validators?: Validator[];
  hint?: string;
  textareaRows?: number;
  textareaMaxRows?: number;
  suffix?: string;
  prefix?: string;
  suffixIcon?: string;
  prefixIcon?: string;
}

export interface Validator {
  name: 'min' | 'max' | 'required' | 'requiredTrue' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  parameters?: any;
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

