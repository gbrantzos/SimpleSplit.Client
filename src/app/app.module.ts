import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from '@core/components/login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideMenuComponent } from '@core/components/side-menu/side-menu.component';
import { HeaderComponent } from '@core/components/header/header.component';
import { MainLayoutComponent } from '@core/components/main-layout/main-layout.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from '@core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from "@core/interceptors/error.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SideMenuComponent,
    HeaderComponent,
    MainLayoutComponent
  ],
  imports: [
    BrowserModule,
    SharedModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
