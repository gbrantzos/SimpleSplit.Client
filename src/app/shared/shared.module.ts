import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { materialModules } from "@shared/materialModules";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";
import { ListHeaderComponent } from '@shared/components/list-header/list-header.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { NoDataComponent } from '@shared/components/no-data/no-data.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { BaseButtonDirective } from './directives/base-button.directive';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { GenericListComponent } from './components/generic-list/generic-list.component';
import { GenericTableComponent } from './components/generic-table/generic-table.component';
import { AdvancedSearchComponent } from './components/advanced-search/advanced-search.component';

export const SIMPLE_SPLIT_FORMATS = {
  parse: {
    dateInput: 'D/M/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    ListHeaderComponent,
    LoadingComponent,
    NoDataComponent,
    PaginatorComponent,
    ConfirmDialogComponent,
    BaseButtonDirective,
    ServerErrorComponent,
    GenericListComponent,
    GenericTableComponent,
    AdvancedSearchComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...materialModules
  ],
  exports: [
    ReactiveFormsModule,
    ...materialModules,
    ListHeaderComponent,
    LoadingComponent,
    NoDataComponent,
    PaginatorComponent,
    BaseButtonDirective,
    ServerErrorComponent,
    GenericListComponent
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
        {provide: MAT_DATE_LOCALE, useValue: 'el-GR'},
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: SIMPLE_SPLIT_FORMATS}
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
