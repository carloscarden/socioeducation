import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(
    private router: Router,
    public authenticationService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log("entra");
    const currentUser = this.authenticationService.currentUserValue;
    
    if (currentUser) {
        // logged in so return true
        console.log("autorizado");
        return true;
    }

    // not logged in so redirect to login page with the return url
    console.log("no autorizado");
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
