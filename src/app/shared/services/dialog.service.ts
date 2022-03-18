import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from "@angular/material/dialog";
import { GenericDialogComponent } from "@shared/components/generic-dialog/generic-dialog.component";
import { firstValueFrom, map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) { }

  public confirm(message: string, title: string = 'Προσοχή'): Promise<boolean> {
    const data:  GenericDialogModel = {
      type: "warning",
      title: title,
      message: message
    };

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '560px',
      panelClass: ['generic-dialog-container', `generic-dialog-container-${data.type}`],
      data: data
    });

    const dialogCall = dialogRef.afterClosed()
      .pipe(map(res => res === true));

    return firstValueFrom(dialogCall);
  }

  public snackMessage(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, config);
  }

  public snackInfo(message: string, action: string = 'Κλείσιμο', config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    const cnf = {
      ...config,
      panelClass: ['snack-panel', 'snack-panel-info']
    };
    return this.snackBar.open(message, action, cnf);
  }

  public snackSuccess(message: string, action: string = 'Κλείσιμο', config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    const cnf = {
      ...config,
      panelClass: ['snack-panel', 'snack-panel-success']
    };
    return this.snackBar.open(message, action, cnf);
  }

  public snackWarning(message: string, action: string = 'Κλείσιμο', config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    const cnf = {
      ...config,
      panelClass: ['snack-panel', 'snack-panel-warning']
    };
    return this.snackBar.open(message, action, cnf);
  }

  public snackError(message: string, action: string = 'Κλείσιμο', config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    const cnf = {
      ...config,
      panelClass: ['snack-panel', 'snack-panel-error']
    };
    return this.snackBar.open(message, action, cnf);
  }
}


export interface GenericDialogModel {
  type: 'alert' | 'warning' | 'information';
  title: string;
  message: string;
}
