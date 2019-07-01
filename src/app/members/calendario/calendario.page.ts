import { Component, OnInit  } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';


// modal para agregar una nueva tarea
import { ModalController, AlertController  } from '@ionic/angular';
import { EventModalPage } from '../event-modal/event-modal.page'


// servicios
import { AgendaServiceService } from 'src/app/_services/agenda-service.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';

import * as moment from 'moment';


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {
  

  restInfScroll;
  page = 0;
  maximumPages = 12;
  inspectorId=1;
  anio=  new Date().getFullYear();
  anioBuscado= new Date().getFullYear();
  nombreMeses= ["ENERO","FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
  mesesCargados=[];
  mesAbuscar=new Date().getMonth().toString();
 
  constructor(
    protected agendaService: AgendaServiceService,
    private modalCtrl: ModalController,
    private router:Router, 
    private authenticationService: AuthenticationService,
    private alertCtrl: AlertController) { 
   
     
    }

  ngOnInit() { 
    this.page=parseInt(this.mesAbuscar)+1;
    this.maximumPages=1;
    this.nuevoMes(this.page);

   }


   nuevoMes(mes, infiniteScroll?){
     // setear el id del inspector
    let currentUser = this.authenticationService.currentUserValue;
    this.inspectorId=currentUser.id;
    this.agendaService.getEvents(mes,this.anio,this.inspectorId)
        .subscribe(res  =>{
                    let mesActual=this.nombreMeses[mes-1];
                    console.log(res);
                    if(res==null){
                      this.mesesCargados.push({nombreMes:mesActual, nroMes:mes, tareas:[]} )
                    }
                    else{

                      this.mesesCargados.push({nombreMes:mesActual, nroMes:mes, tareas:res} );
                    };
                    if (infiniteScroll) {
                      infiniteScroll.target.complete();       
                      } 
                    
        });
  }

  loadMore(infiniteScroll) {
    console.log("entra en el load more");
    console.log("infiniteScroll",infiniteScroll);
    this.restInfScroll=infiniteScroll;
    if(this.page < this.maximumPages){
      
      this.nuevoMes(this.page+1,infiniteScroll);
      this.page++;
      if (this.page >= this.maximumPages) {
        infiniteScroll.target.disabled = true;
      }
    }
    else{
      infiniteScroll.target.disabled = true;
    }
    
  }


  ordenar(){
    var x=this.mesesCargados.sort((a, b) => {
      const genreA = a.nroMes;
      const genreB = b.nroMes;
      
      let comparison = 0;
      if (genreA > genreB) {
        comparison = 1;
      } else if (genreA < genreB) {
        comparison = -1;
      }
      return comparison;
    });

  }


  filtrar(){
    console.log("disable",this.restInfScroll.target.disabled);
      if(this.restInfScroll!=null){
        this.restInfScroll.target.disabled=false;
        console.log("despues del disable",this.restInfScroll.target.disabled);
      }
      this.mesesCargados=[];
      this.anioBuscado= this.anio;
      if(this.mesAbuscar=="todos"){
        if(this.restInfScroll!=null){
          this.restInfScroll.target.disabled=false;
        }
        
          this.maximumPages=12;
          this.page=0;
          for(var _i =0; _i<3; _i++){
            this.nuevoMes(this.page+1);        
            this.page=this.page+1;
      
          }
      }
      else{
        this.page=parseInt(this.mesAbuscar)+1;
        this.maximumPages=1;
        this.nuevoMes(this.page);

      }

   }

  

  changeMode(mode) {
    let url='/members/menu/agenda/'+mode;
    this.router.navigateByUrl(url);
  }

  buscar(mes, nuevaTarea){
    for (var i=0; i < this.mesesCargados.length; i++) {
      if (this.mesesCargados[i].nroMes === mes) {
          this.mesesCargados[i].tareas.push(nuevaTarea);
          return this.mesesCargados[i];
      }
  }
  }



  async addEvent(){
    let modal = await this.modalCtrl.create({
      component: EventModalPage,
      componentProps: { selectedDay: new Date() }
      });
    
    modal.onDidDismiss().then((data) => {
      if (data) {
        

        let eventData = data.data;


        

        let inicio;
        let fin
        if(navigator.userAgent.indexOf("Chrome") != -1 )
        {
                  inicio= new Date(data.data.inicio);
                  fin= new Date(data.data.fin);
        }
        if(navigator.userAgent.indexOf("Firefox") != -1 ) 
        {
          let txtInicio= data.data.inicio.replace(/-/g,"/");
          let txtFin= data.data.fin.replace(/-/g,"/");
          inicio= new Date(txtInicio);
          fin= new Date(txtFin);
        }

        if (data.data.actividad!=null){
          this.buscar(inicio.getMonth()+1,eventData);
        }

        
      

      }

    });
    return await modal.present();
    
  }


  async mostrarTarea(event) {

    let start = moment(event.startTime).format('lll');
    let end = moment(event.endTime).format('lll');
    let alert = await this.alertCtrl.create({
         header: '' +event.actividad.descripcion ,
         subHeader:  event.detalle,
         message: 'Desde:<br> ' + start + '<br><br>Hasta: <br>' + end,
         buttons: ['OK']
    });
    await  alert.present();
}

// Conversiones para que se vea con un formato mejor
  stringAsDate(dateStr) {
    let reemplazar=dateStr.replace(/-/g,"/");
    return new Date(reemplazar);
  }

  hora(dateStr){
    var a=dateStr.split(" ")
    return a[1];
  }







}
