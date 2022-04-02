import { ChangeDetectionStrategy, Component, Injector, SkipSelf } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { SelectCategoryComponent } from "@features/expenses/components/select-category/select-category.component";
import { Expense, ExpensesStore } from "@features/expenses/services/expenses-store";
import { BaseListComponent } from "@shared/components/base-list/base-list.component";
import { ActionSelected } from "@shared/components/generic-list/generic-list.component";
import { DialogService } from "@shared/services/dialog.service";
import { LookupValuesResolver } from "@shared/services/lookup-values.resolver";
import * as moment from "moment";
import { firstValueFrom } from "rxjs";

@Component({
  selector: 'smp-expenses-list',
  templateUrl: '../../../../shared/components/base-list/base-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpensesListComponent extends BaseListComponent<Expense> {
  constructor(store: ExpensesStore,
              route: ActivatedRoute,
              lookupResolver: LookupValuesResolver,
              dialog: DialogService,
              private matDialog: MatDialog,
              @SkipSelf() injector: Injector) {
    super(store, route, lookupResolver, dialog, injector);
  }

  override onNew() {
    this.displayEditor({
      id: 0,
      rowVersion: 0,
      description: '<<Περιγραφή>>',
      enteredAt: moment().startOf('day').toDate(),
      amount: 0,
      category: undefined,
      isOwnerCharge: false
    });
  }

  override async onActionSelected(action: ActionSelected) {
    console.log(action);
    if (!action.rows.length) {
      this.dialog.alert('Για την ενέργεια <strong>Αλλαγή Κατηγορίας</strong>, πρέπει να επιλέξετε εγγραφές από την λίστα!');
      return;
    }
    const category = await firstValueFrom(this.matDialog
      .open(SelectCategoryComponent, {
        width: '460px',
        panelClass: ['generic-dialog-container-information']
      })
      .afterClosed());
    console.log({category, rows: action.rows});
  }

}
