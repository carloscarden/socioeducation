import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform  } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';


// used to create fake backend
import { FakeBackend } from './_helpers/fake-backend';
import { JwtInterceptor } from './_helpers/jwt-interceptor';
import {  ErrorInterceptor } from './_helpers/error-interceptor';
import {  AuthInterceptorService } from './_helpers/auth-interceptor';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// para manejar la camara y la subida de archivos
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

import { FormsModule }   from '@angular/forms';
import { NgCalendarModule  } from 'ionic2-calendar';
import { EventModalPageModule } from './members/event-modal/event-modal.module';
import { IonicSelectableModule } from 'ionic-selectable';

// http corsregisterLocaleData(localeDeAt);
import { HttpBackend, HttpXhrBackend } from '@angular/common/http';
import { NativeHttpModule, NativeHttpBackend, NativeHttpFallback } from 'ionic-native-http-connection-backend';
import { HttpModule } from '@angular/http';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);



// componente del horario
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    FormsModule,
    NgCalendarModule,
    IonicSelectableModule,
    EventModalPageModule,
    NativeHttpModule,
    HttpModule,
    NgxMaterialTimepickerModule,
    BrowserAnimationsModule 

    

    
  ],
  providers: [
    { provide: HttpBackend, useClass: NativeHttpFallback, deps: [Platform, NativeHttpBackend, HttpXhrBackend]},
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackend, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: LOCALE_ID, useValue: 'es' },
   
  
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    
    File,
    FilePath,
    FileOpener,
    MobileAccessibility
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
