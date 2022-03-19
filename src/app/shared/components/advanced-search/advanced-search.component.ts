import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MatSidenav } from '@angular/material/sidenav';
import {
  ADVANCED_SEARCH_SETUP,
  AdvancedSearchSetup, Condition,
  ConditionGroup,
  CriteriaDefinition, isConditionGroup
} from "@shared/components/advanced-search/advanced-search.models";
import * as moment from "moment";
import { forkJoin, map, Observable, of } from "rxjs";

@Component({
  selector: 'smp-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedSearchComponent implements OnInit {
  public sidenavHost: MatSidenav;
  public applySearch: (args: any) => void;
  public clearSearch: () => void;
  public definitions: CriteriaDefinition[] = [];

  public properties: { key: string, label: string }[] = [];
  public operators: { key: string, label: string }[] = [];
  public lookups$: Observable<any>;
  public lookupValues: { [key: string]: string }[] = [];
  public form: FormGroup;
  public activeEditorIndex = -1;
  public groupingMethod = 1;

  private rootGroup: ConditionGroup;

  get criteriaRow(): FormArray { return this.form.get('criteria') as FormArray; }

  constructor(private formBuilder: FormBuilder,
              @Inject(ADVANCED_SEARCH_SETUP) setup: AdvancedSearchSetup) {
    this.sidenavHost = setup.sidenavHost;
    this.definitions = setup.definitions;
    this.applySearch = setup.applySearch;
    this.clearSearch = setup.clearSearch;
    this.rootGroup = setup.conditionGroup ?? {
      grouping: "and",
      conditions: []
    };
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      criteria: this.formBuilder.array([])
    });
    this.properties = this.definitions.map(d => {
      return {key: d.property, label: d.label}
    });
    this.operators = [
      {key: 'starts', label: 'αρχίζει με'},
      {key: 'ends', label: 'τελειώνει με'},
      {key: 'like', label: 'περιέχει'},
      {key: 'eq', label: 'είναι'},
      {key: 'neq', label: 'δεν είναι'},
      {key: 'gt', label: 'είναι μεγαλύτερο από'},
      {key: 'gte', label: 'είναι μεγαλύτερο ή ίσο από'},
      {key: 'lt', label: 'είναι μικρότερο από'},
      {key: 'lte', label: 'είναι μικρότερο ή ίσο από'},
      {key: 'in', label: 'περιλαμβάνεται σε'},
      {key: 'nin', label: 'δεν περιλαμβάνεται σε'},
    ];

    const sources: { [key: string]: any } = {};
    this.definitions.forEach(def => {
      if (def.lookupValues) {
        const values = Object.keys(def.lookupValues).map(key => {
          return {
            key: key,
            value: def.lookupValues[key]
          };
        })
        sources[def.property] = of(values);
      }
      if (def.lookupValuesAsync) {
        sources[def.property] = def.lookupValuesAsync;
      }
    });
    this.lookups$ = forkJoin(sources)
      .pipe(map(result => {
        Object.keys(result).forEach(key => {
          this.lookupValues[key] = result[key];
        })
        return result;
      }));

    this.groupingMethod = this.rootGroup.grouping == "and" ? 1 : 2;
    this.rootGroup.conditions.filter(c => !isConditionGroup(c)).forEach((c: Condition) => {
      const grp = this.formBuilder.group({
        property: c.property,
        operator: c.operator,
        value: [c.value]
      });
      this.criteriaRow.push(grp);
    });
  }

  onExit = () => this.sidenavHost.close()

  onApply = () => {
    this.rootGroup.grouping = this.groupingMethod == 1 ? "and" : "or";
    this.applySearch(this.rootGroup);
  }

  onClear = () => {
    this.rootGroup = {
      grouping: "and",
      conditions: []
    };
    this.clearSearch();
    this.sidenavHost.close();
  }

  addCriterion() {
    if (this.activeEditorIndex >= 0) { return; }
    const grp = this.formBuilder.group({
      property: '',
      operator: '',
      value: ''
    });
    this.criteriaRow.push(grp);
    this.rootGroup.conditions.push({
      property: '',
      operator: '',
      value: undefined
    })
    this.activeEditorIndex = this.criteriaRow.length - 1;
  }

  removeCriterion(index: number) {
    this.criteriaRow.removeAt(index);
    this.rootGroup.conditions.splice(index, 1);
    this.activeEditorIndex = -1;
  }

  setActiveEditor(index: number) {
    if (this.activeEditorIndex >= 0) { return; }
    this.activeEditorIndex = index
  }

  acceptCriterion(criterionForm) {
    const property = criterionForm.get('property').value;
    const operator = criterionForm.get('operator').value;
    const rawValue = criterionForm.get('value').value;
    if (!property || !operator || !rawValue) { return; }

    const definition = this.definitionForProperty(property);
    if (!definition) { return; }
    const value = definition.input == "date"
      ? moment(rawValue).utcOffset(0, true).toDate()
      : rawValue;

    this.rootGroup.conditions[this.activeEditorIndex] = {
      property,
      operator,
      value
    };
    this.activeEditorIndex = -1;
  }

  definitionForProperty = (property: string): CriteriaDefinition =>
    this.definitions.find(d => d.property === property)

  lookupValuesForProperty(property: string) {
    const definition = this.definitionForProperty(property);
    if (!definition) { return []; }

    return definition.lookupValues;
  }

  criteriaValue() {
    const rawValues = [];
    this.criteriaRow.value.map(c => {
      const definition = this.definitionForProperty(c.property);
      if (!definition) { return; }
      rawValues.push({
        property: c.property,
        operator: c.operator,
        value: definition.input == 'date'
          ? moment(c.value ?? '').utcOffset(0, true).toDate()
          : c.value
      })
    });
    return rawValues;
  }

  operatorsForProperty(property: string) {
    const definition = this.definitionForProperty(property);
    if (!definition) { return []; }

    let keys: string[];
    switch (definition.input) {
      case "date":
        keys = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'];
        break;
      case "checkbox":
        keys = ['eq', 'neq'];
        break;
      case "select":
        keys = definition.multi
          ? ['in', 'nin']
          : ['eq', 'neq'];
        break;
      default:
        keys = this.operators.map(op => op.key);
    }
    return this.operators.filter(op => keys.includes(op.key));
  }

  humanReadable(criterionForm): string {
    const property = criterionForm.get('property').value;
    const operator = criterionForm.get('operator').value;
    const rawValue = criterionForm.get('value').value;
    const definition = this.definitionForProperty(property);
    if (!definition) { return ''; }

    const operatorLabel = this.operators.find(op => op.key === operator)?.label;
    let value = definition.input == 'date'
      ? moment(rawValue ?? '').utcOffset(0, true).format('DD/MM/YYYY')
      : (!!definition.lookupValuesAsync || !!definition.lookupValues)
        ? this.getLookupsDisplay(property, rawValue)
        : rawValue;
    if (definition.input == 'checkbox') {
      value = rawValue ? 'Ναι' : 'Οχι';
    }

    return `Το πεδίο <strong>${definition.label}</strong> ${operatorLabel} <strong>${value}</strong>`;
  }

  private getLookupsDisplay(property: string, rawValue: any): string {
    const values: string[] = Array.isArray(rawValue)
      ? rawValue
      : rawValue.split(',');

    return values.map(v => this.lookupValues[property].find(p => p.key === v).value).join(', ');
  }
}

/*

We should add 'valueProvider' which should get a
predefined key/code and return value for criteria

*/
