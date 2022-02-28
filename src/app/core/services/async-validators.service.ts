import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { AsyncValidatorFn, FormGroup } from "@angular/forms";
import { environment } from "@environments/environment";
import { catchError, map, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AsyncValidators {
  private currentValue: string;
  private apiUrl: string;

  constructor(private httpClient: HttpClient) { }

  public setCurrentValue(value: string) {
    this.currentValue = value;
    this.apiUrl = environment.apiUrl;
  }

  emailExistsValidator: AsyncValidatorFn = (ctrl: FormGroup) => {
    const email = ctrl.get('email').value;
    if (!!email && email === this.currentValue) { return of(null) }

    const url = `${this.apiUrl}/users/by-email/${email}`;
    return this.httpClient
      .get(url, {observe: 'response'})
      .pipe(
        map(response => {
          return response.status === 204
            ? null
            : {invalidAsync: true};
        }),
        catchError(err => {
          console.log(err);
          return of({invalidAsyncFailure: err});
        })
      );
  }
}
