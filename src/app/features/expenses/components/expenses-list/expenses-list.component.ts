import { ChangeDetectionStrategy, Component, Injector, SkipSelf } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Expense, ExpensesStore } from "@features/expenses/services/expenses-store";
import { BaseListComponent } from "@shared/components/base-list/base-list.component";
import { DialogService } from "@shared/services/dialog.service";
import { LookupValuesResolver } from "@shared/services/lookup-values.resolver";
import * as moment from "moment";

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

}
