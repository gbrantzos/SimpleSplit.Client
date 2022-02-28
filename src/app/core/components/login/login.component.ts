import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { DialogService } from '@shared/services/dialog.service';
import { delay, finalize } from 'rxjs';

@Component({
  selector: 'smp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public isSubmitted = false;
  public returnUrl: string;
  public hide = true;
  public loading: boolean = false;

  get userName() {
    return this.loginForm.get('userName');
  }

  get password() {
    return this.loginForm.get('password');
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private authenticationService: AuthenticationService) {

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.authenticationService.userLoggedIn) {
      this.router.navigate([this.returnUrl]);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', Validators.required]
    });
  }

  logIn(): void {
    this.loading = true;
    const formValues = this.loginForm.getRawValue();
    this.authenticationService
      .login(formValues.userName, formValues.password)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: user => {
          this.router.navigate([this.returnUrl]);
        },
        error: error => {
          console.error('Login failed', formValues, error);
          const message = typeof (error.error) === 'string'
            ? error.error
            : error.statusText || error;
          this.dialogService.snackWarning(`Αποτυχία σύνδεσης!\n${message}`);
        }
      });
  }
}
