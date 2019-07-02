import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import 'rxjs/add/observable/fromPromise';


import { GestionTerritorial } from '../_models/gestion-territorial';
import { Platform } from '@ionic/angular'

const URL = `http://test2.abc.gov.ar:8080/InspectoresAppSec/`;


@Injectable({
  providedIn: 'root'
})
export class GestionTerritorialService {
  basepath="/api";
 

  constructor(private http: HttpClient,
              private _platform: Platform ) {

        if(this._platform.is("cordova")){
          this.basepath ="test2.abc.gov.ar:8080";
        }
  }

  getAllGestionTerritorial(idInspector, inicio, fin, codigo){

   let urlAenviar = URL+`inspectores/${idInspector}/trabajosAdmin`;


   if(codigo!=null){
       urlAenviar = urlAenviar+`?codigo=${codigo}`;
       if(inicio!=null && fin!=null ){
         urlAenviar= urlAenviar+`&from=${inicio}&to=${fin}`;
       }
       urlAenviar = urlAenviar+`&sort=ASC`;
   }
   else{
       if(inicio!=null && fin!=null ){
          urlAenviar= urlAenviar+`?from=${inicio}&to=${fin}&sort=ASC`;
       }
       else{
           urlAenviar=urlAenviar+`?sort=ASC`;
       }
   }
   return this.http.get<any>(urlAenviar);

  }

  getGestionTerritorialBySize(idInspector, inicio, fin, articulo,size,page): Observable<any>{

   if(articulo==null && inicio==null && fin==null){
      // buscar trabajo admin sin articulo ni fecha
      return this.http.get<any>(URL+`inspectores/${idInspector}/trabajosAdmin?size=${size}&page=${page}&sort=inicio,ASC`);
   }
   else if(articulo!=null && inicio==null && fin==null){
      // buscar trabajo admin con articulo sin fecha
       return this.http.get<any>(URL+`inspectores/${idInspector}/trabajosAdmin?codigo=${articulo}&size=${size}&page=${page}&sort=inicio,ASC`);
   }
   else if(articulo==null && inicio!=null && fin!=null){
     // buscar trabajo admin sin articulo con fecha
      return this.http.get<any>(URL+`inspectores/${idInspector}/trabajosAdmin?from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=inicio,ASC`);
   
   }
   else if(articulo!=null && inicio!=null && fin!=null) {
      // buscar trabajo admin con articulo con fecha
      return this.http.get<any>(URL+`inspectores/${idInspector}/trabajosAdmin?codigo=${articulo}&from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=inicio,ASC`);
   }

}




   /******************************************************************************** */
   /*  TRABAJO ADMINISTRATIVO */
   addGestionTerritorial(trabajoAdmin: GestionTerritorial){
      return this.http.post<any>(URL+`trabajosAdmin`,  trabajoAdmin );
   }
      
   getGestionTerritorial(size,page,idInspector): Observable<any>{
      /* console.log("url");
      console.log(URL+`trabajosAdmin?size=${size}&page=${page}`);*/
      return this.http.get<any>(URL+`inspectores/${idInspector}/trabajosAdmin?size=${size}&page=${page}`);
   }

   
      
   getGestionTerritorialByDate(size,page,idInspector, inicio, fin): Observable<any>{
      /* console.log("url");
      console.log(URL+`trabajosAdmin?size=${size}&page=${page}`);*/
      return this.http.get<any>(URL+`inspectores/${idInspector}/trabajosAdmin?from=${inicio}&to=${fin}&size=${size}&page=${page}`);
   }

   getGestionTerritorialByTipo(size,page,idInspector,tipo){
      console.log(URL+`inspectores/${idInspector}/trabajosAdmin?tipo=${tipo}&size=${size}&page=${page}`);
      return this.http.get<any>(URL+`inspectores/${idInspector}/trabajosAdmin?codigo=${tipo}&size=${size}&page=${page}`);

   }

   getGestionTerritorialByDateAndTipo(size,page,idInspector,inicio,fin,tipo){
      console.log(URL+`inspectores/${idInspector}/trabajosAdmin?codigo=${tipo}&from=${inicio}&to=${fin}&size=${size}&page=${page}`);
      return this.http.get<any>(URL+`inspectores/${idInspector}/trabajosAdmin?codigo=${tipo}&from=${inicio}&to=${fin}&size=${size}&page=${page}`);
 
   }
      
   getTrabajo(idTrabajoAdmin,idInspector): Observable<any> {
      /* console.log("url");
      console.log(URL+`convocatorias?size=${size}&page=${page}`);*/
      return this.http.get<any>(URL+`inspectores/${idInspector}/trabajosAdmin/${idTrabajoAdmin}`);
   }
      
   getTipoGestionTerritorial(): Observable<any>{
      return this.http.get(URL+`tiposTrabajoAdmin/all`);
   }
   /******************************************************************************** */



}
