import { Injectable } from '@angular/core';
import { Md5 } from "ts-md5";

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  public getAvatarUrl(email: string): string {
    const md5 = new Md5();
    return email
      ? `https://www.gravatar.com/avatar/${md5.appendAsciiStr(email).end()}`
      : 'assets/images/default-avatar.png';
  }
}
