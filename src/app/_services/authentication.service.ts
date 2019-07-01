import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {Inspector } from '../_models/inspector'
import { map } from 'rxjs/operators';


const TOKEN_KEY='auth_token';
/*

ADDING AUTHENTICATION PROVIDER AND GUARD

The JWT authentication service is used to login and logout of the application, to login it posts the users 
credentials to the api and checks the response for a JWT token, if there is one it means authentication
was successful so the user details are added to local storage with the token. The token is used by the 
JWT interceptor above to set the authorization header of http requests made to secure api endpoints.

The logged in user details are stored in local storage so the user will stay logged in if they refresh the 
browser and also between browser sessions until they logout. If you don't want the user to stay logged in 
between refreshes or sessions the behaviour could easily be changed by storing user details somewhere less
persistent such as session storage which would persist between refreshes but not browser sessions, or in a
private variable in the authentication service which would be cleared when the browser is refreshed.

There are two properties exposed by the authentication service for accessing the currently logged in user.
 The currentUser observable can be used when you want a component to reactively update when a user logs 
 in or out, for example in the app.component.ts so it can show/hide the main nav bar when the user logs 
 in/out. The currentUserValue property can be used when you just want to get the current value of the 
 logged in user but don't need to reactively update when it changes, for example in the auth.guard.ts 
 which restricts access to routes by checking if the user is currently logged in.


*/
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<Inspector>;
  public currentUser: Observable<Inspector>;

  authenticationState = new BehaviorSubject(false);
  /*
   We have added a check to the constructor so we look for a stored token once the 
  app starts.
   By doing this, we can automatically change the authentication state if the user was 
  previously logged in. In a real scenario you could add an expired check here.
  */
  constructor(private storage:Storage, private platform:Platform, private http: HttpClient) { 
    this.currentUserSubject = new BehaviorSubject<Inspector>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

  }

  login(username: string, password: string){
  
   
    return this.http.post<any>(`http://test2.abc.gov.ar:8080/InspectoresAppSec/auth`, { username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    user.token=localStorage.getItem('token');
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                return user;
            }));
  }

  logout(){
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

  }

  public get currentUserValue(): Inspector {
    return this.currentUserSubject.value;
  }

  isAuthenticated(){
    return this.authenticationState.value;
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    })
  }


}
