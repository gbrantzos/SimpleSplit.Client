import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LookupValuesResolver} from "@shared/services/lookup-values.resolver";
import {FormDefinition, FormItem, Validator} from "@shared/services/schema.models";
import * as moment from "moment";
import {Subscription} from "rxjs";
import {GenericArrayComponent} from "@shared/components/generic-array/generic-array.component";

export interface ModelChangedEvent {
  previous: any | undefined;
  current: any | undefined;
  rawValue: any;
}

@Component({
  selector: 'smp-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericFormComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChildren(GenericArrayComponent) arrays: QueryList<GenericArrayComponent>;
  @Input() definition: FormDefinition;
  @Input() model: any;
  @Output() modelChanged: EventEmitter<any> = new EventEmitter<any>();
  public form: FormGroup;

  private modelChangedFn: any = null;
  private _dirty = false;
  get dirty() {
    return this._dirty;
  }

  private _pristine = true;
  get pristine() {
    return this._pristine;
  }

  get valid() {
    return this.form.valid && !this.arraysEditing;
  }

  get invalid() {
    return !this.valid;
  }

  get arraysEditing() {
    const temp = this.arrays?.toArray() ?? [];
    if (temp && temp.length > 0) {
      return temp.filter(a => a.editing).length > 0;
    }
    return false;
  }

  private previous: any;
  private subscription: Subscription;

  constructor(private lookupResolver: LookupValuesResolver) {
  }

  ngOnInit(): void {
    this.subscription = this.form
      .valueChanges
      .subscribe(value => {
        const current = this.getModel();
        const changes = {
          previous: this.previous,
          current: current,
          rawValue: value
        } as ModelChangedEvent;
        if (this.modelChangedFn) {
          this.modelChangedFn(changes, this.form);
        }
        this.modelChanged.emit(changes);
        this.previous = {...current};
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes['definition']) {
      this.prepareForm();
      if (this.model) {
        this.setModel(this.model);
      }
    }
    if (!!changes['model']) {
      this.setModel(this.model);
    }
  }

  prepareForm() {
    const formGroup = {};
    for (const item of this.definition.items) {
      formGroup[item.name] = new FormControl('', {
        validators: GenericFormComponent.mapValidators(item.validators), updateOn: 'blur'
      });
    }

    this.form = new FormGroup(formGroup);
    if (this.definition.modelChangedExpression) {
      this.modelChangedFn = new Function('changes', 'form', this.definition.modelChangedExpression);
    }
  }

  setModel(model: any, leaveDirty = false) {
    this.previous = undefined;
    this.form?.patchValue(model, {emitEvent: false});
    if (!leaveDirty) {
      this.markAsPristine();
      this._dirty = false;
    } else {
      this.form.markAsTouched();
      this._pristine = false;
    }
  }

  getModel() {
    const result = {};
    for (const item of this.definition.items) {
      const rawValue = this.form.controls[item.name].value;
      result[item.name] = item.type == "date"
        ? moment(rawValue).utcOffset(0, true).toDate()
        : item.isNumber
          ? result[item.name] = Number(rawValue)
          : rawValue;
    }
    return result;
  }

  markAsPristine() {
    this.form?.markAsPristine();
    this._pristine = true;
    this._dirty = false;
  }

  onClearSelect = (event, item: FormItem) => {
    event.stopPropagation();
    this.form.controls[item.name].setValue(null);
  }

  onArrayChanged(value: any, modelProperty: string) {
    // console.log(value, modelProperty);
    this.form.controls[modelProperty].setValue(value);
    this.model[modelProperty] = value;
  }

  hasErrors(key: string): boolean {
    const control = this.form.controls[key];
    return control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(name: string, label?: string): string {
    const control = this.form.controls[name];
    const keyName = label || GenericFormComponent.toCapitalFirst(name);

    let errorMessage = `Σφάλματα στο πεδίο ${keyName}`;
    if (control.errors.required) {
      errorMessage = `Το πεδίο ${keyName} είναι υποχρεωτικό`;
    }
    if (control.errors.min) {
      errorMessage = `Το πεδίο ${keyName} πρέπει να είναι μεγαλύτερο από ${control.errors.min.min}`;
    }
    if (control.errors.max) {
      errorMessage = `Το πεδίο ${keyName} πρέπει να είναι μικρότερο από ${control.errors.max.max}`;
    }
    if (control.errors.minLength) {
      errorMessage = `Το πεδίο ${keyName} πρέπει να είναι περισσότερο από ${control.errors.min.minLength} χαρακτήρες`;
    }
    if (control.errors.maxLength) {
      errorMessage = `Το πεδίο ${keyName} πρέπει να είναι λιγότερο από ${control.errors.max.maxLength} χαρακτήρες`;
    }
    if (control.errors.pattern) {
      errorMessage = `Το πεδίο ${keyName} δεν ταιριάζει με το υπόδειγμα `;
    }
    if (control.errors.email) {
      errorMessage = `Το πεδίο ${keyName} δεν είναι έγκυρο email`;
    }

    return errorMessage;
  }

  split = (text: string, separator: string = ' '): string[] => text.split(separator)

  async onRefreshSelect(event: MouseEvent, item: FormItem) {
    event.stopPropagation();
    const lookup = await this.lookupResolver.resolveLookups([item.lookupName], true);
    if (lookup.length >= 1) {
      item.lookupValues = lookup[0].items;
    }
  }

  private static mapValidators(validators: Validator[]) {
    const formValidators = [];

    for (const validation of validators ?? []) {
      switch (validation.name) {
        case 'required':
          formValidators.push(Validators.required);
          break;
        case 'requiredTrue':
          formValidators.push(Validators.requiredTrue);
          break;
        case 'min':
          formValidators.push(Validators.min(validation.parameters));
          break;
        case 'max':
          formValidators.push(Validators.max(validation.parameters));
          break;
        case 'minLength':
          formValidators.push(Validators.minLength(validation.parameters));
          break;
        case 'maxLength':
          formValidators.push(Validators.maxLength(validation.parameters));
          break;
        case 'pattern':
          formValidators.push(Validators.pattern(validation.parameters));
          break;
        case 'email':
          formValidators.push(Validators.email);
          break;
      }
    }
    return formValidators;
  }

  private static toCapitalFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  asIsOrder(a, b) {
    return 1;
  }
}
