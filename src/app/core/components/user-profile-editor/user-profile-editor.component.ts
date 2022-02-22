import { Component, OnInit } from '@angular/core';
import { AuthenticationService, User } from "@core/services/authentication.service";
import { AvatarService } from "@core/services/avatar.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { UserProfile, UserProfileService } from "@core/services/user-profile.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DialogService } from "@shared/services/dialog.service";
import { ConfirmPasswordComponent } from "@core/components/confirm-password/confirm-password.component";
import { firstValueFrom } from "rxjs";

@Component({
  selector: 'smp-user-profile-editor',
  templateUrl: './user-profile-editor.component.html',
  styleUrls: ['./user-profile-editor.component.scss']
})
export class UserProfileEditorComponent implements OnInit {
  public userForm: FormGroup;
  public hide = true;
  public currentUser: User;
  public avatarUrl: string | ArrayBuffer;
  private uploadedImage: string | ArrayBuffer;
  private uploadedFileName: string;

  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private avatarService: AvatarService,
              private profileService: UserProfileService,
              private authenticationService: AuthenticationService,
              private dialogService: DialogService,
              private matDialog: MatDialog,
              private dialogRef: MatDialogRef<UserProfileEditorComponent>) {
    this.currentUser = authenticationService.currentUser;
    this.avatarUrl = avatarService.getAvatarUrl(this.currentUser?.email);
  }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      displayName: [this.currentUser.displayName, [Validators.required, Validators.minLength(5)]],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      password: [''],
      useGravatar: [true]
    });
  }

  formControl = (controlName: string) => this.userForm.get(controlName);

  onSave = async () => {
    const profile: UserProfile = {
      userId: this.authenticationService.currentUser.id,
      displayName: this.formControl('displayName')?.value,
      email: this.formControl('email')?.value,
      useGravatar: !!this.formControl('useGravatar').value,
      fileName: this.uploadedFileName ?? '',
      image: new Blob([this.uploadedImage])
    };

    const newPassword = this.formControl('password').value;
    if (!!newPassword) {
      const confirmRef = this.matDialog
        .open(ConfirmPasswordComponent, {
          hasBackdrop: true,
          disableClose: true,
          data: newPassword
        })
        .afterClosed()
      const confirmResult = await firstValueFrom<{ match: boolean; oldPassword: string }>(confirmRef);
      if (!confirmResult.match) { return; }
      profile.changePasswordInfo = {
        newPassword: newPassword,
        oldPassword: confirmResult.oldPassword
      };
    }

    this.profileService
      .save(profile)
      .subscribe({
        next: value => {
          if (!!value) {
            // Some error occured
            this.dialogService.snackError(`Η ενημέρωση του προφίλ χρήστη απέτυχε!\n${value}`);
            return;
          }
          this.dialogRef.close(value);
          this.dialogService.snackInfo('Η ενημέρωση του προφίλ χρήστη ολοκληρώθηκε!');
        },
        error: err => {
          console.error(err);
          this.dialogService.snackError(err);
        }
      });
  }

  onAvatarClear = () => {
    const useGravatar = !!this.formControl('useGravatar').value;
    this.uploadedImage = null;
    this.uploadedFileName = undefined;
    this.avatarUrl = this.avatarService.getAvatarUrl(this.currentUser?.email, useGravatar);
  }

  onFileChanged(files: FileList) {
    if ((files?.length ?? 0) === 0) {
      return;
    }

    this.uploadedImage = null;
    this.uploadedFileName = undefined;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.avatarUrl = reader.result;
      this.uploadedImage = reader.result;
      this.uploadedFileName = files[0].name;
    }
  }
}
