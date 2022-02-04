import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly STORAGE_ITEM = 'SimpleSplit_UserDetails';
  private userSubject: BehaviorSubject<User>;
  public user$: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject<User>(null);
    this.user$ = this.userSubject.asObservable();

    const tmp = JSON.parse(localStorage.getItem(this.STORAGE_ITEM));
    if (!tmp) { return; }
    const {user, expirationDate} = tmp;
    const now = new Date();
    if (new Date(expirationDate) > now && !!user) {
      this.userSubject.next(user);
    }
  }

  get currentUser(): User { return this.userSubject.value; }
  get userLoggedIn() : boolean { return !!this.currentUser; }

  login(userName: string, password: string): Observable<User> {
    return this.http
      .post('http://localhost:4100/users', {userName, password})
      .pipe(map((resp: any) => {
        const user = {
          id: resp.user.id,
          userName: resp.user.userName,
          displayName: resp.user.displayName,
          token: resp.token
        } as User;
        const expirationDate = this.getExpirationDate(user.token);
        this.userSubject.next(user);
        localStorage.setItem(this.STORAGE_ITEM, JSON.stringify({user, expirationDate}));

        return user;
      }));
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem(this.STORAGE_ITEM);
    this.router.navigate(['/login']);
  }

  // Add refresh token functionality
  // https://jasonwatmore.com/post/2020/07/25/angular-10-jwt-authentication-with-refresh-tokens

  private getExpirationDate(jwtToken: string) {
    const dateToken = JSON.parse(atob(jwtToken.split('.')[1]));
    return new Date(dateToken.exp * 1000);
  }
}


export interface User {
  id: number;
  userName: string;
  displayName: string;
  token: string;
}
