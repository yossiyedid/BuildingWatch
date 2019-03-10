
import { NgModule } from '@angular/core';
import {ActivatedRoute, RouterModule, Routes} from "@angular/router";
import {TenantListComponent} from "./tenants/tenant-list/tenant-list.component";
import {TenantCreateComponent} from "./tenants/tenant-create/tenant-create.component";
import {LoginComponent} from "./auth/login/login.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {AuthGuard} from "./auth/auth.guard";

const routes: Routes = [
  { path: '', component: TenantListComponent, canActivate:[AuthGuard]},
  { path: 'create', component: TenantCreateComponent, canActivate:[AuthGuard]},
  { path: 'edit/:tenantId', component: TenantCreateComponent, canActivate:[AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent}
  ];

@NgModule({

  imports: [
  RouterModule.forRoot(routes)],//taking the routes config
  exports: [RouterModule],   //exporting the config
  providers:[AuthGuard] //guard the routes from who is not auth


})
export class AppRoutingModule {

}
