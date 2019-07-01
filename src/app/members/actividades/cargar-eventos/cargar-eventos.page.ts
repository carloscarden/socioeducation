import { Component, OnInit } from '@angular/core';


import { first } from 'rxjs/operators';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';



import { ToastController, Platform, AlertController } from '@ionic/angular';



/*  SERVICES */
import { ConvocatoriaServiceService } from '../../../_services/convocatoria-service.service';
import { ActividadesService } from '../../../_services/actividades.service';
import { AuthenticationService } from '../../../_services/authentication.service';


/*  MODELOS */
import { Convocatoria } from '../../../_models/convocatoria';
import { TipoConvocatoria } from '../../../_models/tipo-convocatoria';
import { Imagen } from '../../../_models/imagen';
import { Distrito } from 'src/app/_models/distrito';




@Component({
  selector: 'app-cargar-eventos',
  templateUrl: './cargar-eventos.page.html',
  styleUrls: ['./cargar-eventos.page.scss'],
})
export class CargarEventosPage implements OnInit {
  convocatoria = new Convocatoria();
  
  tiposConvocatorias: TipoConvocatoria[];
 
  actividadesSubscription: Subscription;
 
  /* manejo de las imagenes  */
  images = [];
  imagesWeb = [];
  megasDeLosArchivos=[];
  totalMegasDeLosArchivos=0;


  esPlataformaMovil=this.plt.is('android');

  /* validaciones de alta del formulario */
  cargaCorrecta = false;
  loading = false;
  error= '';
  horasNoValidas=false;

  horaInicio;
  horaFin;


  myDate;

  datePickerObj: any = {
    showTodayButton: false, // default true
    fromDate: new Date('2016-12-08'), // default null
    toDate: new Date('2100-12-28'),
    closeOnSelect: true, // default false
    setLabel: 'Aceptar',  // default 'Set'
    todayLabel: 'Hoy', // default 'Today'
    dateFormat: 'DD-MM-YYYY',
    closeLabel: 'Cancelar', // default 'Close'
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


  
  distritos: Distrito[];
  pageDistrito=0;
  maximumPages;
  distritoAfiltrar="";
  size=15;
  distritoSubscription: Subscription;
  
 
  constructor(
    private plt: Platform,
    private toastController: ToastController,

    private authenticationService: AuthenticationService,
    private actividadesService: ActividadesService,
    private convocatoriaService: ConvocatoriaServiceService,
    private alertCtrl: AlertController
  ) { 
    this.actividadesService.getDistritos(this.distritoAfiltrar,this.size,this.pageDistrito).subscribe(
      resEncuadres => {
         this.distritos= this.distritos.concat(resEncuadres['content']);
         this.pageDistrito++;
         this.maximumPages= resEncuadres.totalPages-1;
      }
)
  }

  ngOnInit() {
    /* id del inspector */
   
    this.convocatoria.inicio=null;
  }

  async presentAlert(msj) {
    const alert = await this.alertCtrl.create({
      header: msj,
      buttons: ['OK']
    });

    await alert.present();
  }

  onSubmit() {
    this.loading = true;
    let imgsConvertidas =[];

    /* convertir todas las imagenes al formato que acepta el backend */
    for(let img of this.imagesWeb){
      let conversion= img.archivo.split(',');
      // en conversion[1] tengo la imagen
      img.archivo = conversion[1];
      imgsConvertidas.push(img);
    }
    // vacio el array de las imagenes
    this.imagesWeb=[];

    // agrego las imagenes con el formato correcto
    this.convocatoria.adjuntos=imgsConvertidas;

    

    /****************************************************************************** */

    /* formato correcto del dia mes y año */
    let inicio=this.convocatoria.inicio.split("-");
    let fechaFormat=inicio[1]+"-"+inicio[0]+"-"+inicio[2]; 

    /* convertir la fecha de inicio al formato que acepta el backend*/
    let formatoCorrectoHoraInicio=this.parsearLaHora(this.horaInicio);
    let formatoCorrectoInicio=fechaFormat+" "+formatoCorrectoHoraInicio;
    this.convocatoria.inicio=formatoCorrectoInicio;


    
    /* convertir la fecha de fin al formato correcto el backend*/
    let formatoCorrectoHoraFin=this.parsearLaHora(this.horaFin);
    let formatoCorrectoFin=fechaFormat+" "+formatoCorrectoHoraFin;
    this.convocatoria.fin=formatoCorrectoFin;


     /*  Asignarle el inspector id del usuario logueado */
     let currentUser = this.authenticationService.currentUserValue;
     this.convocatoria.inspectorId=currentUser.id;


     
    
     
     
     console.log("hora inicio",this.horaInicio);
      
     console.log("hora fin",this.horaFin);
     console.log("formato correcto a enviar hora inicio",formatoCorrectoHoraInicio);
     console.log("formato correcto a enviar hora fin",formatoCorrectoHoraFin);
     console.log("formato correcto fin", formatoCorrectoFin)
     console.log("convocatoria", this.convocatoria);



     /* ----------------------------------------------------------------------- */

     if(this.validarHoras(formatoCorrectoHoraInicio,formatoCorrectoHoraFin)){

          this.convocatoriaService.addConvocatoria(this.convocatoria).pipe(first())
          .subscribe(
              data => {
                
                this.loading=false;
                this.convocatoria = new Convocatoria();
                this.horaInicio;
                this.horaFin;
                this.error = '';
                this.presentAlert("Enviado con éxito. ");
              },
              error => {
                  console.log('error en el data', error);
                  this.presentAlert("Hubo un error, intente nuevamente. ");
                  this.error = error;
                  this.loading = false;
              });;
     }
     else{
        this.presentToast("la hora fin debe de ser mayor a la hora de inicio");
        this.convocatoria.inicio=null;
     }

   
        /************************************************* */

  }

   // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.convocatoria); }



  /****************************** TIPOS CONVOCATORIAS ************************************************************ */

  filterPorts(tipos: TipoConvocatoria[], text: string) {
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
    this.convocatoriaService.getTipoConvocatorias();

    this.actividadesSubscription = this.convocatoriaService.getTipoConvocatorias().subscribe(tipos => {
      // Subscription will be closed when unsubscribed manually.
     /* var tareas=JSON.parse(tipos._body);*/
     if (this.actividadesSubscription.closed) {
        return;
      }

      event.component.items = this.filterPorts(tipos, text);
      event.component.endSearch();
    });
  }


  /******************************************************************************************** */


  


  searchDistritos(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    this.distritoAfiltrar = event.text.trim();
    event.component.startSearch();

    // Close any running subscription.
    if (this.distritoSubscription) {
      this.distritoSubscription.unsubscribe();
    }

    this.pageDistrito=0;
    this.actividadesService.getDistritos(this.distritoAfiltrar,this.size,this.pageDistrito).subscribe(
      resEncuadres => {
        if(resEncuadres!=null){
          console.log("resEncuadres a filtrar",resEncuadres);
          event.component.items = resEncuadres['content'];
          this.maximumPages= resEncuadres.totalPages-1;
          this.pageDistrito++;
          event.component.endSearch();
          event.component.enableInfiniteScroll();

        }
        else{
          console.log("no hay encuadres");
          event.component.items = [];
          this.maximumPages= -1;
          this.pageDistrito++;
          event.component.endSearch();
          event.component.endInfiniteScroll();
        }
         
    });

  }


  getMoreDistritos(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
     // There're no more ports - disable infinite scroll.
     if (this.pageDistrito > this.maximumPages) {
      event.component.disableInfiniteScroll();
      return;
    }

    this.actividadesService.getDistritos(this.distritoAfiltrar,this.size,this.pageDistrito).subscribe(
      resEncuadres => {
        console.log("resEncuadres",resEncuadres);
          resEncuadres = event.component.items.concat(resEncuadres['content']);
          

 
          event.component.items = resEncuadres;
          event.component.endInfiniteScroll();
          this.pageDistrito++;
    });
  }

  /******************************************************************************************** */


  async presentToast(text) {
    const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
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
