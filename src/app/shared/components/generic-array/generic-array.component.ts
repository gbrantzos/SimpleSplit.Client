import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ArrayOptions, FormDefinition} from "@shared/services/schema.models";
import {GenericFormComponent} from "@shared/components/generic-form/generic-form.component";
import {DialogService} from "@shared/services/dialog.service";

@Component({
  selector: 'smp-generic-array',
  templateUrl: './generic-array.component.html',
  styleUrls: ['./generic-array.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericArrayComponent implements OnInit {
  @ViewChild('form') form: GenericFormComponent;
  @Input() label: string;
  @Input() arrayOptions: ArrayOptions;

  private _model: any[];
  @Input()
  get model(): any[] {
    return this._model;
  }

  set model(value: any[]) {
    this._model = value.sort((a, b) => a[this.arrayOptions.orderingProperty].localeCompare(b[this.arrayOptions.orderingProperty]));
  }

  @Output() arrayChanged: EventEmitter<any> = new EventEmitter<any>();

  public get editing(): boolean {
    return this.activeEditorIndex != -1
  }

  public displayFn: any = null;
  public newItemFn: any = null;
  public activeEditorIndex: number = -1;
  private rowAdded: boolean = false;

  constructor(private dialog: DialogService) {
  }

  ngOnInit(): void {
    if (this.arrayOptions.displayExpression) {
      this.displayFn = new Function('row', this.arrayOptions.displayExpression);
    }
    if (this.arrayOptions.newItemExpression) {
      this.newItemFn = new Function('model', this.arrayOptions.newItemExpression);
    }
    if (!this.model) {
      this.model = [];
    }
  }

  setActiveEditor(index: number) {
    if (this.activeEditorIndex != -1) {
      return;
    }
    this.activeEditorIndex = index;
  }

  async removeItem(index: number) {
    if (await this.dialog.confirm('Πρόκειται να διαγράψετε την εγγραφή! Θέλετε να συνεχίσετε;') === false) {
      return;
    }
    this.model = this.model.filter((_, i) => i !== index);
    this.arrayChanged.emit(this.model);
    this.activeEditorIndex = -1;
  }

  addItem() {
    if (this.activeEditorIndex != -1) {
      return;
    }
    this.rowAdded = true;
    this.activeEditorIndex = this.model.push(this.newItemFn ? this.newItemFn(this.model) : {}) - 1;
  }

  cancelEdit() {
    this.activeEditorIndex = -1;
    if (this.rowAdded) {
      this.model.pop();
      this.rowAdded = false;
    }
  }

  saveEdit(index: number) {
    if (!this.form.valid) {
      this.dialog.snackWarning('Παρακαλώ διορθώστε τα λάθη στη φόρμα!');
      return;
    }
    const changed = this.form.getModel();

    this.model = this.model.map((v, i) => i === index ? {...v, ...changed} : v);
    this.arrayChanged.emit(this.model);
    this.activeEditorIndex = -1;
  }

  onModelChanged(event) {
    //console.log(event);
  }
}
