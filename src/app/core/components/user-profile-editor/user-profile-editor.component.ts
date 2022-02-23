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
  private uploadedImage: File;
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
    this.uploadedFileName = this.currentUser.profileImagePath;
    this.avatarUrl = avatarService.getAvatarUrl(this.currentUser);
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
      userName: this.authenticationService.currentUser.userName,
      displayName: this.formControl('displayName')?.value,
      email: this.formControl('email')?.value,
      useGravatar: !!this.formControl('useGravatar').value,
      fileName: this.uploadedFileName ?? '',
      image: this.uploadedImage
    };

    let shouldLogout = false;
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
      shouldLogout = true;
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
          if (shouldLogout) {
            this.authenticationService.logout();
          } else {
            this.authenticationService.refreshCurrentUser(profile.displayName,
              profile.email,
              profile.fileName,
              profile.useGravatar);
          }
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
    this.avatarUrl = this.avatarService.getAvatarUrl({
      ...this.currentUser,
      useGravatar: useGravatar,
      hasProfileImage: false,
      profileImagePath: null
    });
  }

  onFileChanged(files: FileList) {
    this.formControl('useGravatar').setValue(false);
    this.uploadedImage = null;
    this.uploadedFileName = undefined;
    if ((files?.length ?? 0) === 0) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.avatarUrl = reader.result;
    }
    this.uploadedImage = files[0];
    this.uploadedFileName = files[0].name;
  }

  triggerFileInput(fileInput) {
    fileInput.value = null;
    fileInput.click()
  }
}
