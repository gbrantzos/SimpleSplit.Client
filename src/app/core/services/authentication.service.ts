import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { delay, map, Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from "@environments/environment";
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly STORAGE_ITEM = 'SimpleSplit_UserDetails';
  private readonly apiUrl: string;
  private userSubject: BehaviorSubject<User>;
  private refreshTokenTimeout;

  public user$: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = environment.apiUrl;

    this.userSubject = new BehaviorSubject<User>(null);
    this.user$ = this.userSubject.asObservable();

    const tmp = JSON.parse(localStorage.getItem(this.STORAGE_ITEM));
    if (!tmp) {
      return;
    }
    const {user, expiration} = tmp;
    const expirationDate = new Date(expiration);
    const now = new Date();
    if (expirationDate > now && !!user) {
      this.userSubject.next(user);
    }
  }

  get currentUser(): User {
    return this.userSubject.value;
  }

  get userLoggedIn(): boolean {
    return !!this.currentUser;
  }

  login(userName: string, password: string): Observable<User> {
    const url = `${this.apiUrl}/users`
    return this.http
      .post(url, {
        userName,
        password
      })
      .pipe(map((resp: any) => {
        const user = {
          id: resp.user.id,
          userName: resp.user.userName,
          email: resp.user.email,
          displayName: resp.user.displayName,
          token: resp.token,
          hasProfileImage: resp.user.hasProfileImage,
          profileImagePath: resp.user.profileImagePath
        } as User;
        const expirationDate = AuthenticationService.getExpirationDate(user.token);
        this.userSubject.next(user);
        console.log(`Token expires at ${expirationDate}`);
        localStorage.setItem(this.STORAGE_ITEM, JSON.stringify({
          user,
          expiration: expirationDate.getTime()
        }));
        this.startRefreshTokenTimer();

        return user;
      }));
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem(this.STORAGE_ITEM);
    this.stopRefreshTokenTimer();
    this.router.navigate(['/login']);
  }

  refreshToken() {
    const url = `${this.apiUrl}/users/refresh-token`;
    if (!this.currentUser) {
      return of(true);
    }

    return this.http.post<any>(url, {
        jwtToken: this.currentUser.token
      }, {
        headers: new HttpHeaders({Authorization: `Bearer ${this.currentUser.token}`})
      })
      .pipe(map((resp) => {
        const newUser = {
          ...resp.user,
          token: resp.newToken
        };
        this.userSubject.next(newUser);
        const expirationDate = AuthenticationService.getExpirationDate(this.currentUser.token);
        localStorage.setItem(this.STORAGE_ITEM, JSON.stringify({
          user: newUser,
          expiration: expirationDate.getTime()
        }));
        console.log(`%cToken refreshed, expires at ${expirationDate}`, 'background: #555; color: yellow');
        this.startRefreshTokenTimer();
        return newUser;
      }));
  }

  refreshCurrentUser(displayName: string, email: string, profileImagePath: string, useGravatar: boolean) {
    this.userSubject.next({
      ...this.currentUser,
      displayName: displayName,
      email: email,
      profileImagePath: profileImagePath,
      useGravatar: useGravatar,
      hasProfileImage: !!profileImagePath
    });
  }

  private startRefreshTokenTimer() {
    const expires = AuthenticationService.getExpirationDate(this.currentUser.token);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    // console.log(`Next refresh at ${new Date(expires.getTime() - (60 *1000))} in ${timeout / 1000} seconds`);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  private static getExpirationDate(jwtToken: string) {
    const dateToken = JSON.parse(atob(jwtToken.split('.')[1]));
    return new Date(dateToken.exp * 1000);
  }
}


export interface User {
  id: number;
  userName: string;
  email: string;
  displayName: string;
  profileImagePath: string;
  hasProfileImage: boolean;
  useGravatar: boolean;
  token: string;
}
