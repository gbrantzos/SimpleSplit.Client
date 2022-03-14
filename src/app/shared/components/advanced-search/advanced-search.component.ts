import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSidenav } from '@angular/material/sidenav';
import * as moment from "moment";
import { forkJoin, map, Observable, of } from "rxjs";

@Component({
  selector: 'smp-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedSearchComponent implements OnInit {
  @Input() sidenavHost: MatSidenav;
  @Input() onSuccess: (args: any) => void;
  @Input() definitions: CriteriaDefinition[] = [];

  public properties: { key: string, label: string }[] = [];
  public operators: { key: string, label: string }[] = [];
  public lookups$: Observable<any>;
  public lookupValues: { [key: string]: string }[] = [];
  public form: FormGroup;
  public activeEditorIndex = -1;
  public groupingMethod = 1;

  get criteriaRow(): FormArray { return this.form.get('criteria') as FormArray; }

  constructor(private formBuilder: FormBuilder) { }

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
      }))
  }

  onExit = () => this.sidenavHost.close()

  onApply = () => {
    console.log(this.criteriaValue());
  }

  addCriterion() {
    if (this.activeEditorIndex >= 0) { return; }
    const grp = this.formBuilder.group({
      property: ['', Validators.required],
      operator: ['', Validators.required],
      value: ['', Validators.required]
    });
    this.criteriaRow.push(grp);
    this.activeEditorIndex = this.criteriaRow.length - 1;
  }

  removeCriterion(index: number) {
    this.criteriaRow.removeAt(index);
    this.activeEditorIndex = -1;
  }

  acceptCriterion(criterionForm) {
    if (!criterionForm.valid) { return; }
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
        keys = ['eq', 'neq'];
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

/*

We should add 'valueProvider' which should get a
predefined key/code and return value for criteria

*/
