import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'smp-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss']
})
export class ConfirmPasswordComponent implements OnInit {
  public hide: boolean = true;
  public form: FormGroup;
  private readonly newPassword: string;

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<ConfirmPasswordComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string) {
    this.newPassword = data;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(this.newPassword)]],
    })
  }

  onConfirm = () => {
    const newPassword = this.form.controls['newPassword'].value;
    if (this.newPassword !== newPassword) { return; }

    this.dialogRef.close({
      match: true,
      oldPassword: this.form.controls['oldPassword'].value
    });
  }

  onCancel = () => {
    this.dialogRef.close({
      match: false,
      oldPassword: ''
    });
  }
}
