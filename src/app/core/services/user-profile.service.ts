import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private url: string;

  constructor(private httpClient: HttpClient) {
    this.url = `${environment.apiUrl}/images`;
  }

  public save(profile: UserProfile): Observable<string> {
    const formData = new FormData();
    formData.append('displayName', profile.displayName);
    formData.append('email', profile.email);
    formData.append('fileName', profile.fileName);
    formData.append('image', profile.image);
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
  userId: number;
  displayName: string;
  email: string;
  useGravatar: boolean;
  fileName: string;
  image: Blob;
  changePasswordInfo?: ChangeUserPassword;
}
