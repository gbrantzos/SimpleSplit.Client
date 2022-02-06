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
        catchError(err => {console.log(err)
          if ([401, 403].includes(err.status) && this.authService.currentUser) {
            // Auto logout
            this.authService.logout()
          }

          const error = (err && err.error && err.error.message) || err.statusText;
          console.error(err);
          return throwError(error);
        }))
  }

}
