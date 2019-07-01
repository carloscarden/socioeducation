import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../_models/user';
import { Role } from '../_models/role';
import { Inspeccion } from '../_models/inspeccion';
import { Establecimiento } from '../_models/establecimiento';
import { AuthenticationService } from '../_services/authentication.service';

/*  AGENDA */
import { Calendario } from '../_models/calendario';

/* TAREAS DEL INSPECTOR */
import { Licencia } from '../_models/licencia';

import { Convocatoria } from '../_models/convocatoria';
import { TipoConvocatoria } from '../_models/tipo-convocatoria';

import { TrabajoAdministrativo } from '../_models/trabajo-administrativo';
import { TipoTrabajoAdministrativo } from '../_models/tipo-trabajo-administrativo';





/*
The fake backend provider enables the example to run without a backend / backendless,

It's implemented using the HttpInterceptor class that was introduced in Angular 4.3 as part of the new
HttpClientModule. By extending the HttpInterceptor class you can create a custom interceptor to modify 
http requests before they get sent to the server. In this case the FakeBackendInterceptor intercepts 
certain requests based on their URL and provides a fake response instead of going to the server.



*/
@Injectable()
export class FakeBackend implements HttpInterceptor{
    private inspeccionCollection:Inspeccion[] = [
        { id: 1,
          task: 'task1', 
          priority: 1,
          createdAt: 1 , 
          usuario:{
            id: 1,
            username: "Ad",
            role: "distrital"
          },
          establecimiento:{
            cue:"1",
            distrito: 1,
            descripcionDistrito:"BERAZATEGUI",
            region: "I"
          } 
        },


        { id: 2, 
          task: 'task2',
          priority: 2,
          createdAt: 3 ,
          usuario:{
            id: 1,
            username: "Ad",
            role: "distrital"
          },
          establecimiento:{
            cue:"2",
            distrito: 1,
            descripcionDistrito:"BERAZATEGUI",
            region: "I"
          } 
        },


        { id: 3, 
          task: 'task3',
          priority: 3, 
          createdAt: 4 ,
          usuario:{
            id: 2,
            username: "Ar",
            role: "regional"
          },
          establecimiento:{
            cue:"3",
            distrito: 1,
            descripcionDistrito:"BERAZATEGUI",
            region: "I"
          } 
        },


        { id: 4, 
          task: 'task4', 
          priority: 4,
          createdAt: 5,
          usuario:{
            id: 2,
            username: "Bd",
            role: "distrital"
          },
          establecimiento:{
            cue:"4",
            distrito: 2,
            descripcionDistrito:"BRANDSEN",
            region: "I"
          } 
        },


        { id: 5, 
          task: 'task5', 
          priority: 5,
          createdAt: 6,
          usuario:{
            id: 1,
            username: "Br",
            role: "regional"
          },
          establecimiento:{
            cue:"5",
            distrito: 1,
            descripcionDistrito:"BRANDSEN",
            region: "I"
          } 
        }
      ];
   
    
    private tareasCollection:Calendario[]=[];


    /* TAREAS DEL INSPECTOR */
    private licenciaCollection: Licencia[] =[]; 
    
    private establecimientosCollection:Establecimiento[] =[
        {
            cue:"1",
            nombre: "",
            tipoOrg:"BERAZATEGUI",
            localidad: "I"
          } ,
        {
            cue:"2",
            nombre:  "",
            tipoOrg:"BERAZATEGUI",
            localidad: "I"
          } ,
        {
            cue:"3",
            nombre: "1",
            tipoOrg:"BERAZATEGUI",
            localidad: "I"
          },
        {
            cue:"4",
            nombre: "2",
            tipoOrg:"BRANDSEN",
            localidad: "I"
          } ,
        {
            cue:"5",
            nombre: "1",
            tipoOrg:"BRANDSEN",
            localidad: "I"
          } ,
        {  cue: "6",
           nombre: "3",
           tipoOrg: "F VARELA",
           localidad: "string"
        },
        {  cue: "7",
           nombre:" 4",
           tipoOrg: "MONTE",
           localidad: "string"
        },
       
        
        {  cue: "10",
            nombre:" 1",
            tipoOrg: "LANUS",
            localidad: "string"
        },


      ];
    
    private trabajosAdministrativosCollection:TrabajoAdministrativo[]=[];
    private tiposTrabajosAdministrativoCollection:TipoTrabajoAdministrativo[]=[
      {id:1,codigo:1,descripcion:"lalal"},
      {id:2,codigo:2,descripcion:"lalal"},
      {id:3, codigo:3,descripcion:"lalal"},
      {id:4, codigo:4,descripcion:"lalal"}];

    private convocatoriaCollection: Convocatoria[] =[]; 
    private tipoConvocatoriaCollection:TipoConvocatoria[]=[
      { id: 1,
        codigo: 1,
        descripcion: "Plenario"},
      { id: 2,
        codigo: 2,
        descripcion: "Concurso"},
      {  id: 3,
        codigo: 3,
        descripcion: "Prueba Seleccion"},
      {  id: 4,
        codigo: 4,
        descripcion: "Capacitacion"},
      {  id: 5,
        codigo: 5,
        descripcion: "Citacion de Autoridad Compentente"},
      {  id: 6,
        codigo: 6,
        descripcion: "Otro"}
    ];

    constructor(private authenticationService: AuthenticationService) { } 

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const users: User[] = [
            { id: 1, 
              username: 'Ad',
              password: 'Ad',
              firstName: 'Ad', 
              lastName: 'Ad', 
              role: Role.UserDistrital,
              influencia:{
                  distrito:1,
                  region:"0"
              }
              
            },


            { id: 2,
             username: 'Bd',
             password: 'Bd', 
             firstName: 'Bd', 
             lastName: 'Bd',
              role: Role.UserDistrital,
              influencia:{
                  distrito:2,
                  region:"0"
              }
            
            },


            { id: 3,
              username: 'Ar',
              password: 'Ar', 
              firstName: 'Ar',
              lastName: 'Ar',
              role: Role.UserRegional,
              influencia:{
                  distrito:1,
                  region:"I"
              }
            
            },

            { id: 4,
                username: 'Br',
                password: 'Br', 
                firstName: 'Br',
                lastName: 'Br',
                role: Role.UserRegional,
                influencia:{
                    distrito:1,
                    region:"II"
                }
              
              },

            { id: 5,
                username: 'G',
                password: 'G', 
                firstName: 'G',
                lastName: 'G',
                role: Role.UserGeneral,
                influencia:{
                    distrito:1,
                    region:"II"
                }
              
              },
        ];

        const authHeader = request.headers.get('Authorization');
        const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-jwt-token');
        const roleString = isLoggedIn && authHeader.split('.')[1];
        const role = roleString ? Role[roleString] : null;


        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate - public
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                const user = users.find(x => x.username === request.body.username && x.password === request.body.password);
                if (!user) return error('Username or password is incorrect');
                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    influencia: user.influencia,
                    token: `fake-jwt-token`
                });
            }
            // get ALL establecimientos
            if(request.url.endsWith('/members/establecimientos') && request.method === 'GET'){
                if (!isLoggedIn) return unauthorised();
                return ok(this.establecimientosCollection);
            }

            /* ***************************************************************************** */
            /* ***************************************************************************** */
                                    /* INSPECCIONES */
            
            // get ALL Inspecciones
            if (request.url.endsWith('/members/inspecciones') && request.method === 'GET') {
                if (!isLoggedIn) return unauthorised();
                return ok(this.inspeccionCollection);
            }

            // add Inspecciones
            if (request.url.endsWith('/members/addInspeccion') && request.method === 'POST') {
                const inspeccionNueva = request.body.inspeccion;
                if (!isLoggedIn) return unauthorised();
                this.inspeccionCollection.push(inspeccionNueva);
                return ok("Nueva Inspeccion Agregada");
            }

            // delete Inspecciones
            if (request.url.endsWith('/members/inspecciones/delete') && request.method === 'POST') {
                if (!isLoggedIn) return unauthorised();
                const inspeccionIndex = this.inspeccionCollection.findIndex(x => x.id === request.body.id);
                if (inspeccionIndex==-1) return error('No encontrado');
                this.inspeccionCollection.splice(inspeccionIndex,1);
                return ok("La inspeccion se elimino");
            }

            // get an Inspeccion
            if (request.url.endsWith('/members/inspecciones/details') && request.method === 'POST') {
                if (!isLoggedIn) return unauthorised();
                const inspeccion = this.inspeccionCollection.find(x => x.id === request.body.id);
                if (!inspeccion) return error('Username or password is incorrect');
                return ok(inspeccion);
            }
             /********************************************************************************* */
            // add a licencia
            if (request.url.endsWith('/members/addLicencia') && request.method === 'POST') {
              const licenciaNueva = request.body.licencia;
              if (!isLoggedIn) return unauthorised();
              this.licenciaCollection.push(licenciaNueva);
              return ok("Nueva Licencia Agregada");
          }
            /* ***************************************************************************** */
            // addConvocatoria
            if (request.url.endsWith('/members/addConvocatoria') && request.method === 'POST') {
              const convocatoriaNueva = request.body.convocatoria;
              if (!isLoggedIn) return unauthorised();
              this.convocatoriaCollection.push(convocatoriaNueva);
              return ok("Nueva Convocatoria Agregada");
            }

             // tipos convocatoria
             if (request.url.endsWith('/members/tipoConvocatorias') && request.method === 'GET') {
              if (!isLoggedIn) return unauthorised();
              return ok(this.tipoConvocatoriaCollection);
            }

            /* ***************************************************************************** */

             // addConvocatoria
             if (request.url.endsWith('/members/addTrabajoAdmin') && request.method === 'POST') {
              const trabajoAdmin = request.body.trabajoAdmin;
              if (!isLoggedIn) return unauthorised();
              this.trabajosAdministrativosCollection.push(trabajoAdmin);
              return ok("Nueva Convocatoria Agregada");
            }

            // get ALL tipoTrabajoAdmin
            if (request.url.endsWith('/members/tipoTrabajoAdmin') && request.method === 'GET') {
              if (!isLoggedIn) return unauthorised();
              return ok(this.tiposTrabajosAdministrativoCollection);
            }

             /******************************************************************************* */
            // AGENDA
            if (request.url.endsWith('/members/tareas') && request.method === 'GET') {
              if (!isLoggedIn) return unauthorised();
              return ok(this.tiposTrabajosAdministrativoCollection);
            }

            if (request.url.endsWith('/members/agregarTarea') && request.method === 'POST') {
              const tarea = request.body.calendario;
              if (!isLoggedIn) return unauthorised();
              this.tareasCollection.push(tarea);
              return ok("Nueva Tarea Agregada");
            }

            /* ************************************************************************ */

            // pass through any requests not handled above
            return next.handle(request);
        }))
        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());

        // private helper functions

        function ok(body) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorised() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ status: 400, error: { message } });
        }
    }
}
