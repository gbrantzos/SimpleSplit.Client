import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { materialModules } from "@shared/materialModules";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";
import { ListHeaderComponent } from '@shared/components/list-header/list-header.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { PaginatorComponent } from './components/paginator/paginator.component';


@NgModule({
  declarations: [
    ListHeaderComponent,
    LoadingComponent,
    NoDataComponent,
    PaginatorComponent
  ],
  imports: [
    CommonModule,
    ...materialModules
  ],
  exports: [
    ReactiveFormsModule,
    ...materialModules,
    ListHeaderComponent,
    LoadingComponent,
    NoDataComponent,
    PaginatorComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        {
          provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
          useValue: {
            duration: 5000,
            panelClass: 'snack-bar',
            horizontalPosition: 'right',
          },
        },
        // {
        //   provide: MAT_DIALOG_DEFAULT_OPTIONS,
        //   useValue: {
        //     hasBackdrop: true,
        //     backdropClass: 'dialog-backdrop'
        //   },
        // },
      ]
    }
  }
}
