import { ChangeDetectionStrategy, Component, Injector, SkipSelf } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Building, BuildingsStore } from "@features/buildings/services/buildings-store";
import { BaseListComponent } from "@shared/components/base-list/base-list.component";
import { DialogService } from "@shared/services/dialog.service";
import { LookupValuesResolver } from "@shared/services/lookup-values.resolver";

@Component({
  selector: 'smp-buildings-list',
  templateUrl: '../../../../shared/components/base-list/base-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildingsListComponent extends BaseListComponent<Building> {

  constructor(private buildingsStore: BuildingsStore,
              route: ActivatedRoute,
              lookupResolver: LookupValuesResolver,
              dialog: DialogService,
              private matDialog: MatDialog,
              @SkipSelf() injector: Injector) {
    super(buildingsStore, route, lookupResolver, dialog, injector);
  }

}
