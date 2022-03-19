import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSidenav } from "@angular/material/sidenav";
import { CategoriesStore } from "@features/expenses/services/categories-store";
import { Expense, ExpensesStore } from "@features/expenses/services/expenses-store";
import { EmptyConditionGroup } from "@shared/components/advanced-search/advanced-search.models";
import { DefaultQueryParameters } from "@shared/models/query-parameters";
import { DialogService } from "@shared/services/dialog.service";
import * as moment from 'moment';
import { map, Observable } from "rxjs";

@Component({
  selector: 'smp-expenses-editor',
  templateUrl: './expenses-editor.component.html',
  styleUrls: ['./expenses-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpensesEditorComponent implements OnInit {
  @Input() public sidenavHost: MatSidenav;
  @Input() public onSuccess: (args: any) => void;

  public _expense: Expense;
  get expense(): Expense { return this._expense; }

  @Input() set expense(e: Expense) {
    this._expense = e;
    this.allowDelete = !(e.id == 0 && e.rowVersion == 0);
  };

  public expenseEditor!: FormGroup;
  public allowDelete: boolean = false;
  public categories$: Observable<string[]>;
  public working: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private store: ExpensesStore,
              private categoryStore: CategoriesStore,
              private dialog: DialogService) {
    this.categories$ = categoryStore
      .items
      .pipe(
        map(state => [...new Set(state.result.rows.map(c => c.description))])
      );
    categoryStore.load(DefaultQueryParameters, EmptyConditionGroup);
  }

  ngOnInit(): void {
    this.expenseEditor = this.formBuilder.group({
      id: [0],
      rowVersion: [0],
      description: ['', Validators.required],
      category: [''],
      enteredAt: ['', Validators.required],
      isOwnerCharge: [false],
      amount: [0, [Validators.required, Validators.min(0.01)]]
    });
    if (this.expense) {
      this.expenseEditor.patchValue((this.expense));
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.expenseEditor.controls[controlName];
    return control && control.invalid && control.touched;
  }

  onExit = () => this.sidenavHost.close()

  onSave = async (): Promise<void> => {
    this.working = true;
    const expense = this.getExpenseFromEditor();
    const message = await this.store.save(expense);
    this.working = false;

    if (message !== '') {
      console.warn(`Η αποθήκευση απέτυχε: ${message}`, expense);
      this.dialog.snackError(`Η αποθήκευση απέτυχε!\n${message}`);
      return;
    }

    this.dialog.snackSuccess('Η εγγραφή αποθηκεύτηκε!', 'Κλείσιμο')
    this.sidenavHost.close();
    this.onSuccess('SAVED');
  }

  onDelete = async (): Promise<void> => {
    if (await this.dialog.confirm('Πρόκειται να διαγράψετε την εγγραφή! Θέλετε να συνεχίσετε;') === false) {
      return;
    }

    const expense = this.getExpenseFromEditor();
    const message = await this.store.delete(expense.id, expense.rowVersion);
    if (message !== '') {
      console.warn(`Η διαγραφή απέτυχε: ${message}`, expense);
      this.dialog.snackError(`Η διαγραφή απέτυχε!\n${message}`);
      return;
    }

    this.dialog.snackSuccess('Η εγγραφή διαγράφηκε!', 'Κλείσιμο')
    this.sidenavHost.close();
    this.onSuccess('DELETED');
  }

  onClearCategory = (event) => {
    event.stopPropagation();
    this.expenseEditor.controls["category"].setValue(null);
  }

  private getExpenseFromEditor(): Expense {
    const form = this.expenseEditor.getRawValue();

    return {
      id: form.id,
      rowVersion: form.rowVersion,
      description: form.description,
      category: form.category,
      enteredAt: moment(form.enteredAt).utcOffset(0, true).toDate(),
      isOwnerCharge: !!form.isOwnerCharge,
      amount: parseFloat(form.amount)
    };
  }
}
