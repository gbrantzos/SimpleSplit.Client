import { Injectable } from '@angular/core';
import { Md5 } from "ts-md5";
import { User } from "@core/services/authentication.service";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = environment.apiUrl;
  }

  public getAvatarUrl(user: User): string {
    const md5 = new Md5();
    if (user && user.hasProfileImage) {
      return `${this.apiUrl}/images/user/${user.id}?tt=${new Date().getTime()}`;
    }
    if (user && user.useGravatar && user.email) {
      return `https://www.gravatar.com/avatar/${md5.appendAsciiStr(user.email).end()}`
    }
    return 'assets/images/default-avatar.png';
  }
}
