import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private snackBar: MatSnackBar) { }

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
