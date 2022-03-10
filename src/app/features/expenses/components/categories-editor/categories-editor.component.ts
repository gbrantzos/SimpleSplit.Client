import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSidenav } from "@angular/material/sidenav";
import { CategoriesStore, Category } from "@features/expenses/services/categories-store";
import { DialogService } from "@shared/services/dialog.service";

@Component({
  selector: 'smp-categories-editor',
  templateUrl: './categories-editor.component.html',
  styleUrls: ['./categories-editor.component.scss']
})
export class CategoriesEditorComponent implements OnInit {
  @Input() public sidenavHost: MatSidenav;
  @Input() public onSuccess: (args: any) => void;

  public _category: Category;
  get category(): Category { return this._category; }

  @Input() set category(c: Category) {
    this._category = c;
    this.allowDelete = !(c.id == 0 && c.rowVersion == 0);
  };

  public categoryEditor!: FormGroup;
  public allowDelete: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private store: CategoriesStore,
              private dialog: DialogService) { }

  ngOnInit(): void {
    this.categoryEditor = this.formBuilder.group({
      id: [0],
      rowVersion: [0],
      description: ['', Validators.required],
      kind: [0, Validators.pattern('^(1|2|3){1}$')]
    });
    if (this.category) {
      this.categoryEditor.patchValue((this.category));
    }
  }

  onExit = () => this.sidenavHost.close()

  onDelete = async () => {
    if (await this.dialog.confirm('Πρόκειται να διαγράψετε την εγγραφή! Θέλετε να συνεχίσετε;') === false) {
      return;
    }

    const categ = this.getCategoryFromEditor()
    const message = await this.store.delete(categ.id, categ.rowVersion);
    if (message !== '') {
      console.warn(`Η διαγραφή απέτυχε: ${message}`, categ);
      this.dialog.snackError(`Η διαγραφή απέτυχε!\n${message}`);
      return;
    }

    this.dialog.snackSuccess('Η εγγραφή διαγράφηκε!', 'Κλείσιμο')
    this.sidenavHost.close();
    this.onSuccess('DELETED');
  }

  isInvalid(controlName: string): boolean {
    const control = this.categoryEditor.controls[controlName];
    return control && control.invalid && control.touched;
  }

  onSave = async () => {
    const categ = this.getCategoryFromEditor();
    const message = await this.store.save(categ);

    if (message !== '') {
      console.warn(`Η αποθήκευση απέτυχε: ${message}`, categ);
      this.dialog.snackError(`Η αποθήκευση απέτυχε!\n${message}`);
      return;
    }

    this.dialog.snackSuccess('Η εγγραφή αποθηκεύτηκε!', 'Κλείσιμο')
    this.sidenavHost.close();
    this.onSuccess('SAVED');
  }

  private getCategoryFromEditor(): Category {
    const form = this.categoryEditor.getRawValue();

    return {
      id: form.id,
      rowVersion: form.rowVersion,
      description: form.description,
      kind: parseInt(form.kind)
    };
  }
}
