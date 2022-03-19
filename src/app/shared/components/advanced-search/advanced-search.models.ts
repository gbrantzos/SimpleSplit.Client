import { InjectionToken } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { Observable } from "rxjs";

export const ADVANCED_SEARCH_SETUP = new InjectionToken<{}>('ADVANCED_SEARCH_SETUP');

export interface AdvancedSearchSetup {
  sidenavHost: MatSidenav;
  applySearch: (args: any) => void;
  clearSearch: () => void;
  definitions: CriteriaDefinition[];
  conditionGroup?: ConditionGroup;
}

export interface CriteriaDefinition {
  property: string;
  label: string;
  input: 'text' | 'select' | 'date' | 'checkbox';
  multi?: boolean;
  lookupValues?: {
    [key: string]: string
  },
  lookupValuesAsync?: Observable<{ key: string, label: string }>
}

export interface Condition {
  property: string;
  operator: string;
  value: any | any[];
}

export interface ConditionGroup {
  grouping: "and" | "or";
  conditions: (Condition | ConditionGroup)[];
}

export const EmptyConditionGroup: ConditionGroup = {
  grouping: "and",
  conditions: []
}

export function isConditionGroup(condition: ConditionGroup | Condition): condition is ConditionGroup {
  return (condition as ConditionGroup).grouping !== undefined;
}
