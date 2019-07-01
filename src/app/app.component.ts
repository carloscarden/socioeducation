import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Router } from '@angular/router';
import { AuthenticationService } from './_services/authentication.service';

import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthenticationService,
    private router: Router,
    private mobileAccesibility: MobileAccessibility
  ) {
    this.initializeApp();
  }
/*
Finally, we can influence our routing logic at the top of the app .

We simply subscribe to our own authentication state and if a user becomes authenticated,
we automatically switch to the inside area or otherwise for a logged out user back to
the login.


*/
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if(this.platform.is('android')){
        this.mobileAccesibility.usePreferredTextZoom(false);
      }

      this.authenticationService.authenticationState.subscribe(state => {
        if (state) {
          this.router.navigate(['members', 'agenda']);
        } else {
          this.router.navigate(['login']);
        }
      });
      
    });
  }
}
