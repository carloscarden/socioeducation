import { Component, OnInit  } from '@angular/core';
import { ToastController,ModalController, AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { Actividad } from 'src/app/_models/actividad';
import { Tarea } from 'src/app/_models/tarea';
import { AgendaServiceService } from 'src/app/_services/agenda-service.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';


import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.page.html',
  styleUrls: ['./event-modal.page.scss'],
})
export class EventModalPage implements OnInit {
  actividadesSubscription: Subscription;

  evento = new Tarea();
  selectedDay:any;


  quisoAgendarSinActividad=false;
  fechasNoValidas=false;
  noSonLicencias=false;
  esLicencia=false;


   //para las licencias
   inicio;
   fin;


   diaPermitido=false;
   diaCorrecto=true;
 
 
   // para las otras actividades
   fecha;
   horaInicio;
   horaFin;
   horasNoValidas=false;
   fechaNull=false;


   myDate;

   datePickerObj: any = {
     showTodayButton: false, // default true
     fromDate: new Date('2016-12-08'), // default null
     toDate: new Date('2100-12-28'),
     closeOnSelect: true, // default false
     setLabel: 'Aceptar',  // default 'Set'
     todayLabel: 'Hoy', // default 'Today'
     closeLabel: 'Cancelar', // default 'Close'
     dateFormat: 'DD-MM-YYYY',
     titleLabel: 'Seleccione una fecha', // default null
     monthsList: ["En", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
     weeksList: ["D", "L", "M", "M", "J", "V", "S"],
     momentLocale: 'es-AR', // Default 'en-US'
     btnProperties: {
       expand: 'block', // Default 'block'
       fill: '', // Default 'solid'
       size: '10px', // Default 'default'
       disabled: '', // Default false
       strong: '', // Default false
       color: '' // Default ''
     },
     arrowNextPrev: {
       nextArrowSrc: 'assets/images/arrow_right.svg',
       prevArrowSrc: 'assets/images/arrow_left.svg'
     } // This object supports only SVG files.
   };
 

  constructor(
              private modalCtrl:ModalController, 
              private agendaService: AgendaServiceService,
              private authenticationService: AuthenticationService,
              private toastController: ToastController,
              private alertCtrl: AlertController) { }

              async presentAlert(msj) {
                const alert = await this.alertCtrl.create({
                  header: msj,
                  buttons: ['OK']
                });
            
                await alert.present();
              }

  ngOnInit() {
    //this.agendaService.getTipoActividades().subscribe(tipoActividades => {this.actividades = tipoActividades; console.log(tipoActividades)}); 

    var d= new Date();
    var dias=["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
    var diaDeLaSemana=dias[d.getUTCDay()];

    if(diaDeLaSemana==="vie"){
      this.diaPermitido=true;
    }



  }


  
 

  

  
  filterPorts(tipos: Actividad[], text: string) {
    return tipos.filter(t => {
      return t.descripcion.toLowerCase().indexOf(text) !== -1 ;
    });
  }

  searchPorts(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    // Close any running subscription.
    if (this.actividadesSubscription) {
      this.actividadesSubscription.unsubscribe();
    }
    this.agendaService.getTipoActividades();

    this.actividadesSubscription = this.agendaService.getTipoActividades().subscribe(tipos => {
      // Subscription will be closed when unsubscribed manually.
      var tareas=tipos;
     if (this.actividadesSubscription.closed) {
        return;
      }

      event.component.items = this.filterPorts(tareas, text);
      event.component.endSearch();
    });
  }
  
  
  


  get diagnostic() { 
    return JSON.stringify(this.evento); }

  async cancel()
  {
    
    this.modalCtrl.dismiss();
  }

  async save() {
    if(this.evento.actividad!=null){
      let errores=this.puedoCargar();
      if(!errores){
        
        // setear el id del inspector
        let currentUser = this.authenticationService.currentUserValue;
        this.evento.idInspector=currentUser.id;
        console.log("tarea nueva",this.evento);
        this.agendaService.addTarea(this.evento).subscribe(
          data => {
            this.evento = new Tarea();
            this.presentAlert("La tarea ha sido creada exitosamente. ");
          },
          error => {
              console.log(error);
          });;
          await this.modalCtrl.dismiss(this.evento);
      }

      

    }
    else{
      this.quisoAgendarSinActividad=true;
         
    }
   
  }




  puedoCargar(){
    let errores=false;
    if(this.esLicencia){
      errores=this.comprobarFechaParaLicencia();
    }
    else{
      errores=this.comprobarFechaParaOtraActividad();
    }
    return errores;

  }


  comprobarFechaParaLicencia(){
    let errores=true;
    if(!this.fechasNoValidas && this.diaCorrecto){

          var d= new Date();
          d.setMinutes(d.getMinutes()+10);
          var hora=d.toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'});
          //setear el inicio de la actividad
          let init=this.inicio.split("-");
          this.evento.inicio=init[1]+"-"+init[0]+"-"+init[2]+" "+hora;
  
  
          //setear el fin de la actividad
          let end= this.fin.split("-");
          this.evento.fin=end[1]+"-"+end[0]+"-"+end[2]+" "+hora;


          errores=false;
    }
    return errores;
  }


  comprobarFechaParaOtraActividad(){

    let errores = true;
    let hi= this.parsearLaHora(this.horaInicio);
    let hf= this.parsearLaHora(this.horaFin);
    let horasValidas=this.validarHoras(hi,hf);
    if(horasValidas){
        if(this.diaCorrecto){
                /* formato correcto del dia mes y año */
              let init=this.fecha.split("-"); 
              let fechaFormat=init[1]+"-"+init[0]+"-"+init[2]; 
              
              /* convertir la fecha de inicio al formato que acepta el backend*/
              
              let formatoCorrectoInicio=fechaFormat+" "+hi;
              this.evento.inicio=formatoCorrectoInicio;


              /* convertir la fecha de fin al formato correcto el backend*/
              let formatoCorrectoFin=fechaFormat+" "+hf;
              this.evento.fin=formatoCorrectoFin;


              errores=false;
        }

    }
    else{
      this.presentToast("la hora fin debe de ser mayor a la hora de inicio")
    }
    return errores;
  }


  verActividad(){
    console.log("actividad");
    console.log(this.evento.actividad);
    if(this.evento.actividad.descripcion== "Licencia."){
      this.esLicencia=true;
      this.noSonLicencias=false;
    }
    else{
      this.esLicencia=false;
      this.noSonLicencias=true;
    }
  }

  // validar si la hora de inicio es menor a la hora de fin
  validarHoras(horaInicial, horaFinal ){

    // Append any date. Use your birthday.
    const timeInitToDate = new Date('1990-05-06T' + horaInicial + 'Z');
    const timeEndToDate = new Date('1990-05-06T' + horaFinal + 'Z');

    console.log("hora inicio", this.horaInicio);
    console.log("hora fin", this.horaFin);
    if(this.horaInicio && this.horaFin){
      if(timeEndToDate<=timeInitToDate){
        return false;
      }
      else{
        return true;
      }

    }
     return false;
    

   



  }



  // validar si la fecha de inicio es menor a la fecha de fin
  validarFechas(){
    if(this.inicio!=null){
       this.validarDiaCorrectoDeLasLicencias();

       if(this.fin!=null){

        var a = this.inicio.split("-");
        var inicioSinHoras= new Date( parseInt(a[2]) ,parseInt(a[1]), parseInt(a[0])  );

        var b = this.fin.split("-");
        var finSinHoras= new Date(  parseInt(b[2]) ,parseInt(b[1]), parseInt(b[0]) );
            if(finSinHoras<inicioSinHoras){
              this.fechasNoValidas=true;
            }
            else{
              this.fechasNoValidas=false;
            }
       }
    }

 }

 validarDiaCorrectoDeLasLicencias(){
   console.log("entra a validar");
   let d1= new Date();
   let diaDeHoy=new Date(d1.getFullYear(),d1.getMonth(),d1.getDate());


   let d2= this.inicio.split("-");
   console.log("inicio ", d2);
   let diaPosible= new Date(  parseInt(d2[2]) ,parseInt(d2[1])-1, parseInt(d2[0])  );
   console.log(diaPosible);

   let diasPermitidos= new Date();
   diasPermitidos.setDate(diasPermitidos.getDate()+7);

   if(diaPosible>=diaDeHoy && diaPosible<=diasPermitidos){
      this.diaCorrecto=true;
   }
   else{
     this.diaCorrecto=false;
   }

   console.log("diaCorrecto", this.diaCorrecto);
 }


 validarDiaCorrectoDeLasOtrasActividades(){
      console.log("entra a validar");
      let d1= new Date();
      let diaDeHoy=new Date(d1.getFullYear(),d1.getMonth(),d1.getDate());

      let d2= this.fecha.split("-");;
      let diaPosible= new Date(   parseInt(d2[2]) ,parseInt(d2[1])-1, parseInt(d2[0])   );

      
 
      let diasPermitidos= new Date();
      diasPermitidos.setDate(diasPermitidos.getDate()+7);

      console.log("diaDeHoy",diaDeHoy);
      console.log("diaPosible",diaPosible);
      console.log("diasPermitidos",diasPermitidos);

      if(diaPosible>=diaDeHoy && diaPosible<=diasPermitidos){
        this.diaCorrecto=true;
      }
      else{
        this.diaCorrecto=false;
      }

 }


 async presentToast(text) {
  const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
  });
  toast.present();
}


parsearLaHora(unaHoraSinFormatoCorrecto){
      
  let hi=unaHoraSinFormatoCorrecto.split(":");
  let hora=hi[0];
  let minutosYmeridiano= hi[1];
  let minutos=minutosYmeridiano.split(" ");
  let meridiano= minutos[1];
  minutos=minutos[0];
  let hff=hora;
  if(meridiano=="pm"){
     let horaFinal=parseInt(hora)+12;
     if (horaFinal==24){
       horaFinal=0;
     }
     hff=horaFinal.toString();
  }

  let horaParseada= hff+":"+minutos;
  return horaParseada;
 

}



}
