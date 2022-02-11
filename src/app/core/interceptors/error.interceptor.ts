import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { AuthenticationService } from "@core/services/authentication.service";
import { Injectable } from "@angular/core";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .pipe(
        catchError(err => {
          if ([401, 403].includes(err.status) && this.authService.currentUser) {
            // Auto logout
            this.authService.logout()
            // TODO Shall we handle 403 separately?
          }

          console.error(err);
          let errorMessage = '';
          if (err.error instanceof ErrorEvent) {
            // Client-side error
            console.warn('Client side error');
            errorMessage = `${err.error.message || err.statusText}`;
          } else {
            // Server-side error
            console.warn('Server side error');
            errorMessage = typeof (err.error) === 'string'
              ? err.error
              : `${err.message}`;
          }

          return throwError(() => errorMessage);
        }))
  }

}
