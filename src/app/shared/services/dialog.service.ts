import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "@shared/components/confirm-dialog/confirm-dialog.component";
import { firstValueFrom, map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) { }

  public confirm(message: string, title: string = 'Προσοχή'): Promise<boolean> {
    const data = {
      title: title,
      message: message
    } as CommonDialogModel;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '460px',
      panelClass: 'confirm-dialog-container',
      data: data
    });

    const dialogCall = dialogRef.afterClosed()
      .pipe(map(res => res === true));

    return firstValueFrom(dialogCall);
  }

  public snackMessage(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, config);
  }

  public snackInfo(message: string, action: string = 'Close', config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    const cnf = {
      ...config,
      panelClass: ['snack-panel', 'snack-panel-info']
    };
    return this.snackBar.open(message, action, cnf);
  }

  public snackSuccess(message: string, action: string = 'Close', config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    const cnf = {
      ...config,
      panelClass: ['snack-panel', 'snack-panel-success']
    };
    return this.snackBar.open(message, action, cnf);
  }

  public snackWarning(message: string, action: string = 'Close', config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    const cnf = {
      ...config,
      panelClass: ['snack-panel', 'snack-panel-warning']
    };
    return this.snackBar.open(message, action, cnf);
  }

  public snackError(message: string, action: string = 'Close', config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    const cnf = {
      ...config,
      panelClass: ['snack-panel', 'snack-panel-error']
    };
    return this.snackBar.open(message, action, cnf);
  }
}


export interface CommonDialogModel {
  title: string;
  message: string;
}
