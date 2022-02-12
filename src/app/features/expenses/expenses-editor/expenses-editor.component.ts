import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Expense } from "@features/expenses/services/expenses-store";
import * as moment from 'moment';

@Component({
  selector: 'smp-expenses-editor',
  templateUrl: './expenses-editor.component.html',
  styleUrls: ['./expenses-editor.component.scss']
})
export class ExpensesEditorComponent implements OnInit {
  @Input() public sidenavHost: MatSidenav;

  public _expense: Expense;
  get expense(): Expense { return this._expense; }

  @Input()
  public set expense(e: Expense) { this._expense = e; };

  public expenseEditor!: FormGroup;
  public allowDelete: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.expenseEditor = this.formBuilder.group({
      id: [0],
      rowVersion: [0],
      description: ['', Validators.required],
      enteredAt: ['', Validators.required],
      isOwnerCharge: [false],
      amount: [0, Validators.required]
    });
    if (this.expense) {
      this.expenseEditor.patchValue((this.expense));
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.expenseEditor.controls[controlName]
    return control && control.invalid && control.touched;
  }

  onExit = () => {
    this.sidenavHost.close();
  }

  onSave() {
    const formModel = this.getExpenseFromEditor();
    console.log(formModel);
  }

  onDelete() {}

  private getExpenseFromEditor(): Expense {
    const form = this.expenseEditor.getRawValue();
    // console.log('Moment', moment(form.enteredAt).utcOffset(0, true).toISOString());

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

/*
onDelete = async (): Promise<void> => {
    if (await this.dialog.confirm('Πρόκειται να διαγράψετε την εγγραφή!<br />Θέλετε να συνεχίσετε;').toPromise() === false) {
      return;
    }
    const expense: Expense = this.getExpenseFromEditor();

    // if (await !this.service.save(expense)) {
    //   this.dialog.snackError('Η αποθήκευση απέτυχε!', 'Κλείσιμο');
    //   return;
    // }

    // this.dialogRef.close();
  }

  onSave = async (): Promise<void> => {
    const expense = this.getExpenseFromEditor();
    const result = await this.service.save(expense);

    if (!result) {
      console.warn('Η αποθήκευση απέτυχε!', expense);
      return;
    }

    this.dialog.snackSuccess('Η εγγραφή αποθηκεύτηκε!', 'Κλείσιμο')
    this.dialogRef.close();
  }


 */
