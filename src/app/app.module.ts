import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from '@core/components/home/home.component';
import { LoginComponent } from '@core/components/login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/shared/material.module';
import { SideMenuComponent } from './core/components/side-menu/side-menu.component';
import { HeaderComponent } from './core/components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SideMenuComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    MaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
