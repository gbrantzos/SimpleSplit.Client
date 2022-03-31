import { AuthenticationService } from "@core/services/authentication.service";
import { catchError } from "rxjs";

export function authInitializer(authenticationService: AuthenticationService) {
  return () => authenticationService
    .refreshToken()
    .pipe(
      catchError(err => {
        const errorMsgElement = document.querySelector('#errorMessage');
        let message = '<h1>Simple Split</h1><hr/><strong>Application initialization failed!</strong><br/>';
        if (err) {
          if (err.message) {
            message = message + err.message;
          } else {
            message = message + err;
          }
        }
        errorMsgElement.innerHTML = message;

        const loaderWrapper = document.querySelector('#loaderWrapper')
        loaderWrapper.classList.toggle('is-hidden');

        const errorWrapper = document.querySelector('#errorWrapper')
        errorWrapper.classList.toggle('is-visible');
        throw err;
      }));
}
