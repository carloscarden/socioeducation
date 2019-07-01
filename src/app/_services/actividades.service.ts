import { Injectable } from '@angular/core';

import { HttpClient} from '@angular/common/http';

import { Observable } from 'rxjs';

import 'rxjs/add/observable/fromPromise';


import { Platform } from '@ionic/angular'

const URL = `http://test2.abc.gov.ar:8080/InspectoresAppSec/`;
@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  basepath="/api";
 

  constructor(private http: HttpClient,
              private _platform: Platform ) {

        if(this._platform.is("cordova")){
          this.basepath ="test2.abc.gov.ar:8080";
        }
  }
 
 

  getDistritos(nombre,size,page): Observable<any>{
    
    if(!nombre){
      console.log("distritos",URL+`distritos/?size=${size}&page=${page}`);
      return this.http.get<any>(URL+`distritos/?size=${size}&page=${page}`);
    }
    console.log("distritos",URL+`distritos?nombre=${nombre}&size=${size}&page=${page}`);
    return this.http.get<any>(URL+`distritos?nombre=${nombre}&size=${size}&page=${page}`);

  }
  

  

  
}
