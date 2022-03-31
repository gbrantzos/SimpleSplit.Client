import { ChangeDetectionStrategy, Component, Injector, SkipSelf } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { CategoriesStore, Category } from "@features/expenses/services/categories-store";
import { BaseListComponent } from "@shared/components/base-list/base-list.component";
import { DialogService } from "@shared/services/dialog.service";
import { LookupValuesResolver } from "@shared/services/lookup-values.resolver";

@Component({
  selector: 'smp-categories-list',
  templateUrl: '../../../../shared/components/base-list/base-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesListComponent extends BaseListComponent<Category> {
  constructor(store: CategoriesStore,
              lookupResolver: LookupValuesResolver,
              dialog: DialogService,
              route: ActivatedRoute,
              @SkipSelf() injector: Injector) {
    super(store, route, lookupResolver, dialog, injector);
  }

  override onNew = () => {
    this.displayEditor({
      id: 0,
      rowVersion: 0,
      description: 'Νέα κατηγορία εξόδων',
      kind: 0
    });
  }

}
