import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { AsyncValidatorFn, FormGroup } from "@angular/forms";
import { delay, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AsyncValidators {
  private currentValue: string;

  constructor(private httpClient: HttpClient) { }

  public setCurrentValue(value: string) {
    this.currentValue = value;
  }

  emailExistsValidator: AsyncValidatorFn = (ctrl: FormGroup) => {
    const email = ctrl.get('email').value;
    if (!!email && email === this.currentValue) { return of(null) }

    // https://stackoverflow.com/questions/36919011/how-to-add-debounce-time-to-an-async-validator-in-angular-2
    // https://tutorialsforangular.com/2021/03/24/async-validators-in-angular/
    console.log('Async Validator', email);
    return of({invalidAsync: true}).pipe(delay(4000));
  }
}
