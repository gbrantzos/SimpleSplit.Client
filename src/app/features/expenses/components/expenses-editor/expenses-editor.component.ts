import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ExpensesComponent } from "@features/expenses/components/expenses/expenses.component";
import { Expense, ExpensesStore } from "@features/expenses/services/expenses-store";
import * as moment from 'moment';
import { DialogService } from "@shared/services/dialog.service";

@Component({
  selector: 'smp-expenses-editor',
  templateUrl: './expenses-editor.component.html',
  styleUrls: ['./expenses-editor.component.scss']
})
export class ExpensesEditorComponent implements OnInit {
  @Input() public sidenavHost: MatSidenav;
  @Input() public host: ExpensesComponent;

  public _expense: Expense;
  get expense(): Expense { return this._expense; }

  @Input() set expense(e: Expense) {
    this._expense = e;
    this.allowDelete = !(e.id == 0 && e.rowVersion == 0);
  };

  public expenseEditor!: FormGroup;
  public allowDelete: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private store: ExpensesStore,
              private dialog: DialogService) { }

  ngOnInit(): void {
    this.expenseEditor = this.formBuilder.group({
      id: [0],
      rowVersion: [0],
      description: ['', Validators.required],
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
    const expense = this.getExpenseFromEditor();
    const message = await this.store.save(expense);

    if (message !== '') {
      console.warn(`Η αποθήκευση απέτυχε: ${message}`, expense);
      this.dialog.snackError(`Η αποθήκευση απέτυχε!\n${message}`);
      return;
    }

    this.dialog.snackSuccess('Η εγγραφή αποθηκεύτηκε!', 'Κλείσιμο')
    this.sidenavHost.close();
    this.host.loadData();
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
    this.host.loadData();
  }

  private getExpenseFromEditor(): Expense {
    const form = this.expenseEditor.getRawValue();

    return {
      id: form.id,
      rowVersion: form.rowVersion,
      description: form.description,
      enteredAt: moment(form.enteredAt).utcOffset(0, true).toDate(),
      isOwnerCharge: !!form.isOwnerCharge,
      amount: parseFloat(form.amount)
    };
  }
}
