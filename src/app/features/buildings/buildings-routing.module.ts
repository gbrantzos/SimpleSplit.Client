import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchemaResolver } from "@core/services/schema.resolver";
import { BuildingsListComponent } from "@features/buildings/components/buildings-list/buildings-list.component";

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {
    path: 'list',
    component: BuildingsListComponent,
    resolve: {schema: SchemaResolver},
    data: {definitionFile: 'buildings-list'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildingsRoutingModule {}
