import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GenericDialogModel } from "@shared/services/dialog.service";

@Component({
  selector: 'smp-generic-dialog',
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.scss']
})
export class GenericDialogComponent implements OnInit {
  public title: string;
  public message: string;

  constructor(public dialogRef:  MatDialogRef<GenericDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: GenericDialogModel) {
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit(): void {
  }

  onCancel = () => this.dialogRef.close(false)
  onYes = () => this.dialogRef.close(true)
}
