import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import 'rxjs/add/observable/fromPromise';


import { Platform } from '@ionic/angular'

const URL = `http://test2.abc.gov.ar:8080/InspectoresAppSec/`;



@Injectable({
  providedIn: 'root'
})
export class LicenciaServiceService {
  basepath="/api";
 

  constructor(private http: HttpClient,
              private _platform: Platform ) {

        if(this._platform.is("cordova")){
          this.basepath ="test2.abc.gov.ar:8080";
        }
  }


   /******************************************************************************** */
   /* LICENCIAS CRUD */
   addLicencia(licencia: any) {
       /* var headers = new Headers();
      return this.httpOtro.post(URL+`licencias`,  l );*/
            
     const headers = new HttpHeaders();
     headers.set('Content-Type', 'application/json; charset=utf-8');
     headers.set('Accept-Type', 'application/json; charset=utf-8');
     headers.set('Access-Control-Allow-Origin' , '*');
     headers.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
     headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, Content-Range, Content-Disposition, Content-Description');
     return this.http.post<any>(URL+`licencias`, licencia,{headers: headers});
  }

  getLicencias1(size,page,idInspector,inicio, fin, articulo){
     let urlAenviar = URL+`inspectores/${idInspector}/licencias`;


     if(articulo!=null){
         urlAenviar = urlAenviar+`?articulo=${articulo}`;
         if(inicio!=null && fin!=null ){
          urlAenviar= urlAenviar+`&from=${inicio}&to=${fin}`;
        }
        urlAenviar = urlAenviar+`&size=${size}&page=${page}&sort=ASC`;
     }
     else{
          if(inicio!=null && fin!=null ){
            urlAenviar= urlAenviar+`?from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=ASC`;
          }
          else{
            urlAenviar=urlAenviar+`?size=${size}&page=${page}&sort=ASC`;
          }
     }
     
     console.log(urlAenviar);
     return this.http.get<any>(urlAenviar);
    


  }

  getAllLicencias(idInspector,inicio, fin, articulo, size, page){

    if(articulo==null && inicio==null && fin==null){
      // buscar todas las licencias
      return this.http.get<any>(URL+`inspectores/${idInspector}/licencias?size=${size}&page=${page}&sort=inicio,ASC`);

    }
    else if(articulo!=null && inicio==null && fin==null){
      // buscar las licencias por articulo
      return this.http.get<any>(URL+`inspectores/${idInspector}/licencias?articulo=${articulo}&size=${size}&page=${page}&sort=inicio,ASC`);

    }
    else if(articulo==null && inicio!=null && fin!=null){
      // buscar las licencias por inicio y fin
      return this.http.get<any>(URL+`inspectores/${idInspector}/licencias?from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=inicio,ASC`);

    }
    else if(articulo!=null && inicio!=null && fin!=null){
      // buscar las licencias por articulo inicio y fin
      return this.http.get<any>(URL+`inspectores/${idInspector}/licencias?articulo=${articulo}&from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=inicio,ASC`);

    }



  }
            
  getLicencias(size,page,idInspector): Observable<any> {
      /* console.log("url");
      console.log(URL+`licencias?size=${size}&page=${page}`);*/
      return this.http.get<any>(URL+`inspectores/${idInspector}/licencias?size=${size}&page=${page}&sort=ASC`);
  }
  getLicenciasByArticulo(size,page,idInspector,articulo){
    return this.http.get<any>(URL+`inspectores/${idInspector}/licencias?articulo=${articulo}&size=${size}&page=${page}&sort=ASC`);

  }
            
  getLicenciasByDate(size,page,idInspector,inicio,fin): Observable<any> {
      
      console.log(URL+`inspectores/${idInspector}/licencias?from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=ASC`);
      return this.http.get<any>(URL+`inspectores/${idInspector}/licencias?from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=ASC`);
  }

  getLicenciasByArticuloAndDate(size,page,idInspector,inicio,fin,articulo): Observable<any> {
      
    console.log(URL+`inspectores/${idInspector}/licencias?from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=ASC`);
    return this.http.get<any>(URL+`inspectores/${idInspector}/licencias?articulo=${articulo}&from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=ASC`);
  }

 
            
  getLicencia(idLicencia,idInspector): Observable<any>{
     return this.http.get<any>(URL+`inspectores/${idInspector}/licencias/${idLicencia}`);
  }
  /******************************************************************************** */

  getEncuadres(size,page,articulo){
    if(!articulo){
      return this.http.get<any>(URL+`encuadres?size=${size}&page=${page}`);
    }
    else{
      console.log(URL+`encuadres?size=${size}&page=${page}&articulo=${articulo}`);
      return this.http.get<any>(URL+`encuadres?size=${size}&page=${page}&articulo=${articulo}`);
    }
    
  }

 
 


}
