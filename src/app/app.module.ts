import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmPasswordComponent } from '@core/components/confirm-password/confirm-password.component';
import { HeaderComponent } from '@core/components/header/header.component';
import { LoginComponent } from '@core/components/login/login.component';
import { MainLayoutComponent } from '@core/components/main-layout/main-layout.component';
import { NotFoundComponent } from '@core/components/not-found/not-found.component';
import { SideMenuComponent } from '@core/components/side-menu/side-menu.component';
import { UserProfileEditorComponent } from '@core/components/user-profile-editor/user-profile-editor.component';
import { UserProfileComponent } from '@core/components/user-profile/user-profile.component';
import { authInitializer } from "@core/initializers/authInitializer";
import { ErrorInterceptor } from "@core/interceptors/error.interceptor";
import { JwtInterceptor } from '@core/interceptors/jwt.interceptor';
import { AuthenticationService } from "@core/services/authentication.service";
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SideMenuComponent,
    HeaderComponent,
    MainLayoutComponent,
    NotFoundComponent,
    UserProfileComponent,
    UserProfileEditorComponent,
    ConfirmPasswordComponent
  ],
  imports: [
    BrowserModule,
    SharedModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: authInitializer, multi: true, deps: [AuthenticationService]},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
