import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
  ]
})
export class MaterialModule {
  static forRoot(): ModuleWithProviders<MaterialModule> {
    return {
      ngModule: MaterialModule,
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
