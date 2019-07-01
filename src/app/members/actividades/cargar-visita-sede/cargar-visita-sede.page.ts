import { Component, OnInit } from '@angular/core';



/* CAMERA  */
import {  ToastController, AlertController} from '@ionic/angular';

/* SELECTABLE */
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';



/* SERVICES  */
import { ImagenService } from '../../../_services/imagen.service';
import { VisitaServiceService } from '../../../_services/visita-service.service';
import { AuthenticationService } from '../../../_services/authentication.service';


/* MODELS  */
import { Establecimiento } from '../../../_models/establecimiento';
import { VisitaEscuela } from '../../../_models/visita-escuela';
import { Imagen } from '../../../_models/imagen';






@Component({
  selector: 'app-cargar-visita-sede',
  templateUrl: './cargar-visita-sede.page.html',
  styleUrls: ['./cargar-visita-sede.page.scss'],
})
export class CargarVisitaSedePage implements OnInit {
  loading = false;
  visita = new VisitaEscuela();
  
  error:string;
  images = [];
  imagesWeb = [];
  conflicto=false;

  actividadesSubscription: Subscription;

  megasDeLosArchivos=[];
  totalMegasDeLosArchivos=0;

  horasNoValidas=false;
  horaInicio;
  horaFin;

  establecimientos: Establecimiento[];
  estabSubscription: Subscription;
  estabAfiltrar;
  size=15;
  maximumPages;
  pageEstab;
  

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


  inspeccion = {}
  constructor(
    private toastController: ToastController,
    private imgService:  ImagenService,
    private visitaService: VisitaServiceService,
    private authenticationService: AuthenticationService,
    private alertCtrl: AlertController
    ) { 
      this.visitaService.getEstablecimientos(this.estabAfiltrar, this.size, this.pageEstab).subscribe(
        resEstab => {
           this.establecimientos= this.establecimientos.concat(resEstab['content']);
           this.pageEstab++;
           this.maximumPages= resEstab.totalPages-1;
        }
      )

    }

  ngOnInit() {

    this.visita.urgente="T";
    this.visita.establecimiento = new Establecimiento();
    /*this.plt.ready().then(() => {
      this.imgService.loadStoredImages(this.images);
    });*/
  }

  async presentAlert(msj) {
    const alert = await this.alertCtrl.create({
      header: msj,
      buttons: ['OK']
    });

    await alert.present();
  }


  onSubmit() { 
    console.log("cargar");
    this.loading = true;
    let imgsConvertidas =[];
    /* convertir todas las imagenes al formato que acepta el backend */
    for(let img of this.imagesWeb){
      let conversion= img.archivo.split(',');
      img.archivo = conversion[1];
      imgsConvertidas.push(img);
    }
    this.imagesWeb=[];
    this.visita.adjuntos=imgsConvertidas;


   /* formato correcto del dia mes y año */
    let inicio= this.visita.inicio.split("-");
    let fechaFormat=inicio[1]+"-"+inicio[0]+"-"+inicio[2]; 

     /* convertir la fecha de inicio al formato que acepta el backend*/
     let formatoCorrectoHoraInicio=this.parsearLaHora(this.horaInicio);
    let formatoCorrectoInicio=fechaFormat+" "+formatoCorrectoHoraInicio;
    this.visita.inicio=formatoCorrectoInicio;


   /* convertir la fecha de fin al formato correcto el backend*/
   let formatoCorrectoHoraFin=this.parsearLaHora(this.horaFin);
    let formatoCorrectoFin=fechaFormat+" "+formatoCorrectoHoraFin;
    this.visita.fin=formatoCorrectoFin;
    /* ******************************************************************** */
    
    if(this.conflicto){
      this.visita.urgente="T"
    }
    else{
      this.visita.urgente="F"
    }

    

    let currentUser = this.authenticationService.currentUserValue;
    this.visita.inspectorId=currentUser.id;
    console.log("visita escuela a mandar",this.visita);

    if(this.validarHoras(formatoCorrectoHoraInicio,formatoCorrectoHoraFin)){
      this.visitaService.addVisita(this.visita).subscribe(
        data => {
          console.log(data);
           this.loading=false;
           this.visita = new VisitaEscuela();
           this.conflicto=false;
           this.visita.establecimiento = new Establecimiento();
           this.error = '';
           this.horaInicio;
           this.horaFin;
           this.presentAlert("Enviado con éxito.  ");
        },
        error => {
           console.log("error",error);
           if(error=="Entidad Improcesable"){
            this.presentAlert("El cue es incorrecto. ");
           } else{
            this.presentAlert("Hubo un error, intente nuevamente. ");
           }
           console.log("error",error);

           this.loading=false;
           this.visita = new VisitaEscuela();
           this.conflicto=false;
           this.visita.establecimiento = new Establecimiento();
           this.error = '';
           this.horaInicio;
           this.horaFin;
           this.error = error;
        });;

    }
    else{
      this.presentToast("la hora fin debe de ser mayor a la hora de inicio");
      this.visita.inicio=null;
    }
  
  
  }






  searchEstabs(event: {
    component: IonicSelectableComponent,
    text: string
  }){
    this.estabAfiltrar = event.text;
    event.component.startSearch();
    console.log("texto a filtrar", this.estabAfiltrar);
    

     // Close any running subscription.
     if (this.estabSubscription) {
      this.estabSubscription.unsubscribe();
    }

    this.pageEstab=0;
    this.visitaService.getEstablecimientos(this.estabAfiltrar, this.size, this.pageEstab).subscribe(
      resEstab => {
        if(resEstab!=null){
          console.log("resEncuadres a filtrar",resEstab);
          event.component.items = resEstab['content'];
          this.maximumPages= resEstab.totalPages-1;
          this.pageEstab++;
          event.component.endSearch();
          event.component.enableInfiniteScroll();

        }
        else{
          console.log("no hay encuadres");
          event.component.items = [];
          this.maximumPages= -1;
          this.pageEstab++;
          event.component.endSearch();
          event.component.endInfiniteScroll();
        }
         
    });


  }

  getMoreEstabs(event: {
    component: IonicSelectableComponent,
    text: string
  }){
    
     // There're no more ports - disable infinite scroll.
     if (this.pageEstab > this.maximumPages) {
      event.component.disableInfiniteScroll();
      return;
    }

    this.visitaService.getEstablecimientos(this.estabAfiltrar, this.size, this.pageEstab).subscribe(
      resEstabs => {
        console.log("resEncuadres",resEstabs);
        resEstabs = event.component.items.concat(resEstabs['content']);
          

 
          event.component.items = resEstabs;
          event.component.endInfiniteScroll();
          this.pageEstab++;
    });

  }




  /***********************  IMAGENES DE MOVIL ********************************************** */
  async presentToast(text) {
    const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }



  deleteImage(imgEntry, position) {
    this.imgService.deleteImage(imgEntry, position, this.images);
  
  }




  /***********************  IMAGENES DE WEB ********************************************** */
  changeListener(fileLoader) : void {
    fileLoader.click();
    var that = this;
    fileLoader.onchange = function () {
      var archivoWeb = fileLoader.files[0];
      
       //calcular la cantidad de megas del archivo
      let megaPosibleArchivo=(archivoWeb.size/1024)/1024;

       //sumarselo a la cantidad total que tengo de megas
     let posibleArchivoaAgregar=that.totalMegasDeLosArchivos+megaPosibleArchivo;

     if(posibleArchivoaAgregar>4){
        that.presentToast('El archivo supera la cantidad permitida.');
      }
      else{
        that.totalMegasDeLosArchivos=posibleArchivoaAgregar;
        var reader = new FileReader();
        reader.readAsDataURL(archivoWeb);
        reader.onload = (event: any) => {
          let imagenNueva= new Imagen();
          imagenNueva.nombre= archivoWeb.name;
          imagenNueva.tipo = archivoWeb.type;
          imagenNueva.archivo = event.target.result;
          that.imagesWeb.push(imagenNueva) ;
          // en este arreglo tengo todos los valores de los megas que puso el usuario
          that.megasDeLosArchivos.push(megaPosibleArchivo);
        }


      }

    }      
            
  }

  deleteImageWeb(pos){

    // Cuando borro una imagen debo sacarle tambien del total de megas que tengo 
    this.totalMegasDeLosArchivos=--this.megasDeLosArchivos[pos];

    // Borro la imagen
    this.imagesWeb.splice(pos, 1);

    // Saco la cantidad de megas que tiene el archivo
    this.megasDeLosArchivos.splice(pos,1);
    this.presentToast('Archivo removido.');


  }


  // validar si la hora de inicio es menor a la hora de fin
  validarHoras(horaInicial, horaFinal ){

    // Append any date. Use your birthday.
    const timeInitToDate = new Date('1990-05-06T' + horaInicial + 'Z');
    const timeEndToDate = new Date('1990-05-06T' + horaFinal + 'Z');

    console.log("hora inicio", this.horaInicio);
    console.log("hora fin", this.horaFin);

    if(timeEndToDate<=timeInitToDate){
      return false;
    }
    else{
      return true;
    }



  }


  esUnaImagen(tipo){
    let tipoLower=tipo.toLowerCase();
    return tipoLower.includes("image");
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
