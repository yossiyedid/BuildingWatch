import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TenantCreateComponent } from './tenants/tenant-create/tenant-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule} from "@angular/forms";
import {MatIconModule} from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import {
  MatButtonModule,
  MatCardModule,
  MatExpansionModule, MatFormFieldModule, MatInputModule, MatPaginatorModule,
  MatTableModule,
  MatToolbarModule
} from "@angular/material";
import { HeaderComponent } from './header/header.component';
import { TenantListComponent } from './tenants/tenant-list/tenant-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing.module";
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import {AuthInterceptor} from "./auth/auth-interceptor";


@NgModule({
  declarations: [
    AppComponent,
    TenantCreateComponent,
    HeaderComponent,
    TenantListComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatIconModule,
    HttpClientModule,
    MatRadioModule
  ],
  providers: [{provide:HTTP_INTERCEPTORS, useClass:AuthInterceptor , multi:true}], //providing http-interceptor as an angular service
  //multi = true to provide override other angular interceptor
  bootstrap: [AppComponent]
})
export class AppModule {

}
