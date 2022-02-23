import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private url: string;

  constructor(private httpClient: HttpClient) {
    this.url = `${environment.apiUrl}/users/profile`;
  }

  public save(profile: UserProfile): Observable<string> {
    const formData = new FormData();
    formData.append('userName', profile.userName);
    formData.append('displayName', profile.displayName);
    formData.append('email', profile.email);
    formData.append('useGravatar', profile.useGravatar.toString());
    formData.append('fileName', profile.fileName);
    if (!!profile.fileName && !!profile.image) {
      formData.append('image', profile.image, profile.fileName);
    }
    if (profile.changePasswordInfo) {
      formData.append('passwordInfo.oldPassword', profile.changePasswordInfo.oldPassword);
      formData.append('passwordInfo.newPassword', profile.changePasswordInfo.newPassword);
    }

    return this
      .httpClient
      .post(this.url, formData)
      .pipe(
        map(_ => ''),
        catchError(err => of(err))
      );
  }
}

export interface ChangeUserPassword {
  oldPassword: string;
  newPassword: string;
}

export interface UserProfile {
  userName: string;
  displayName: string;
  email: string;
  useGravatar: boolean;
  fileName: string;
  image: File;
  changePasswordInfo?: ChangeUserPassword;
}
