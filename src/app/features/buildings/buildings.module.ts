import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BuildingsListComponent } from "@features/buildings/components/buildings-list/buildings-list.component";
import { BuildingsApiClient } from "@features/buildings/services/buildings-api-client";
import { BuildingsStore } from "@features/buildings/services/buildings-store";
import { SharedModule } from "@shared/shared.module";
import { BuildingsRoutingModule } from './buildings-routing.module';


@NgModule({
  declarations: [
    BuildingsListComponent
  ],
  providers: [
    BuildingsStore,
    BuildingsApiClient
  ],
  imports: [
    CommonModule,
    SharedModule,
    BuildingsRoutingModule
  ]
})
export class BuildingsModule {}
