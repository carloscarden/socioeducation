import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './_services/auth-guard.service';
/*
            APP ROUTING LOGICApp Routing Logic

 The top routing allows to navigate to the register and login page without any checks, 
 but behind the members path every pages will go through the canActivate check so they can
 only be access once a user is authenticated!

 You could also add this checks to every single route, but having all of the routes
 you want to protect within one child routing module helps to save some code and
 structure your app better.
*/
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './public/login/login.module#LoginPageModule' },
  { 
    path: 'members', 
    canActivate: [AuthGuardService],
    loadChildren: './members/member-routing.module#MemberRoutingModule'
  }

  // { path: 'dashboard', loadChildren: './members/dashboard/dashboard.module#DashboardPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
