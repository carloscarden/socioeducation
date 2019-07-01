import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http'

import { Observable, of } from 'rxjs';

import 'rxjs/add/observable/fromPromise';


import { Convocatoria }  from '../_models/convocatoria';
import { Platform } from '@ionic/angular'


const URL = `http://test2.abc.gov.ar:8080/InspectoresAppSec/`;


@Injectable({
  providedIn: 'root'
})
export class ConvocatoriaServiceService {

  basepath="/api";
 

  constructor(private http: HttpClient,
              private httpOtro:Http, // este es el que me funciona en la base de datos
              private _platform: Platform ) {

        if(this._platform.is("cordova")){
          this.basepath ="test2.abc.gov.ar:8080";
        }
  }

  getAllConvocatorias(idInspector, inicio, fin, codigo){

      let urlAenviar = URL+`inspectores/${idInspector}/convocatorias`;

      if(codigo==null && inicio==null && fin==null){
         return this.http.get<any>(urlAenviar);
      }
      else if(codigo==null && inicio!=null && fin!=null){

         urlAenviar= urlAenviar+`?codigo=${codigo}`;
         return this.http.get<any>(urlAenviar);
      }
      else if(codigo==null && inicio!=null && fin!=null){

         urlAenviar= urlAenviar+`?from=${inicio}&to=${fin}&sort=ASC`;
         return this.http.get<any>(urlAenviar);
      
      }
      else if(codigo!=null && inicio!=null && fin!=null) {

         urlAenviar= urlAenviar+`?codigo=${codigo}&from=${inicio}&to=${fin}`;
         return this.http.get<any>(urlAenviar);
      }

  }

  getConvocatoriasBySize(idInspector, inicio, fin, articulo,size,page): Observable<any>{
            console.log("pasa por aca");
            console.log("id inspector",idInspector,"incio", inicio,"fin", fin, "articulo",articulo,"size",size,"page",page);

         if(articulo==null && inicio==null && fin==null){
            console.log("filtrar sin articulo ni fecha");
            console.log(URL+`inspectores/${idInspector}/convocatorias?size=${size}&page=${page}&sort=inicio,ASC`);
            return this.http.get<any>(URL+`inspectores/${idInspector}/convocatorias?size=${size}&page=${page}&sort=inicio,ASC`);
         }
         else if(articulo!=null && inicio==null && fin==null){
            console.log("filtrar con articulo sin fecha");
            console.log(URL+`inspectores/${idInspector}/convocatorias?codigo=${articulo}&size=${size}&page=${page}&sort=inicio,ASC`);
             return this.http.get<any>(URL+`inspectores/${idInspector}/convocatorias?codigo=${articulo}&size=${size}&page=${page}&sort=inicio,ASC`);
         }
         else if(articulo==null && inicio!=null && fin!=null){
            console.log("filtrar sin articulo con fecha");
            console.log(URL+`inspectores/${idInspector}/convocatorias?from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=inicio,ASC`);
            return this.http.get<any>(URL+`inspectores/${idInspector}/convocatorias?from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=inicio,ASC`);
         
         }
         else if(articulo!=null && inicio!=null && fin!=null) {
            console.log(URL+`inspectores/${idInspector}/convocatorias?codigo=${articulo}&from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=inicio,ASC`);
            return this.http.get<any>(URL+`inspectores/${idInspector}/convocatorias?codigo=${articulo}&from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=inicio,ASC`);
         }

  }


  /*  CONVOCATORIA CRUD */
  addConvocatoria(convocatoria: Convocatoria) {
      return this.http.post<any>(URL+`convocatorias`,  convocatoria );
  }
      
  getConvocatorias(size,page,idInspector): Observable<any> {
     /* console.log("url");
     console.log(URL+`convocatorias?size=${size}&page=${page}`);*/
     console.log(URL+`inspectores/${idInspector}/convocatorias?size=${size}&page=${page}&sort=ASC`);
     return this.http.get<any>(URL+`inspectores/${idInspector}/convocatorias?size=${size}&page=${page}&sort=ASC`);
  }
      
  getConvocatoriasByDate(size,page,idInspector, inicio, fin): Observable<any> {
     /* console.log("url");
     console.log(URL+`convocatorias?size=${size}&page=${page}`);*/
     return this.http.get<any>(URL+`inspectores/${idInspector}/convocatorias?from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=ASC`);
  }

  getConvocatoriasByArticulo(size,page,idInspector, articulo): Observable<any> {
   /* console.log("url");
   console.log(URL+`convocatorias?size=${size}&page=${page}`);*/

   console.log(URL+`inspectores/${idInspector}/convocatorias?articulo=${articulo}&size=${size}&page=${page}&sort=ASC`);
   return this.http.get<any>(URL+`inspectores/${idInspector}/convocatorias?codigo=${articulo}&size=${size}&page=${page}&sort=ASC`);
}


  getConvocatoriasByArticuloAndDate(size,page,idInspector, inicio, fin, articulo): Observable<any> {
   /* console.log("url");
   console.log(URL+`convocatorias?size=${size}&page=${page}`);*/
   return this.http.get<any>(URL+`inspectores/${idInspector}/convocatorias?codigo=${articulo}&from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=ASC`);
}
      
  getConvocatoria(idConvocatoria,idInspector): Observable<any> {
     /* console.log("url");
     console.log(URL+`convocatorias?size=${size}&page=${page}`);*/
     return this.http.get<any>(URL+`inspectores/${idInspector}/convocatorias/${idConvocatoria}`);
  }
      
  getTipoConvocatorias(): Observable<any>{
     return this.http.get(URL+`tiposConvocatoria/all`);
  }
      



}
