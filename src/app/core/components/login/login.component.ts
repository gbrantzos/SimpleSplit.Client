import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
  selector: 'smp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitted = false;
  returnUrl: string;

  get userName() { return this.loginForm.get('userName'); }
  get password() { return this.loginForm.get('password'); }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
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
    const formValues = this.loginForm.getRawValue();
    this.authenticationService
      .login(formValues.userName, formValues.password)
      .subscribe(user => {
        this.router.navigate([this.returnUrl]);
      })
  }
}
