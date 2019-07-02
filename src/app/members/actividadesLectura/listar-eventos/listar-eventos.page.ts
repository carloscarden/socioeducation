import { Component, OnInit } from '@angular/core';
import {  Platform } from '@ionic/angular';

import { Subscription } from 'rxjs';

/*  SERVICES */
import { EventoServiceService } from '../../../_services/evento-service.service';
import { AuthenticationService } from '../../../_services/authentication.service';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Evento } from 'src/app/_models/evento';





@Component({
  selector: 'app-listar-eventos',
  templateUrl: './listar-eventos.page.html',
  styleUrls: ['./listar-eventos.page.scss'],
})
export class ListarEventosPage implements OnInit {
  url;
  restInfScroll;

  //para el filtro
  tipo;
  filtroActivado=false;
  inicio;
  fin;
  fechasNoValidas=false;
  inicioFiltro;
  finFiltro;
  tipoFiltro;

  actividadesSubscription: Subscription;
 
   // para la recoleccion de los datos 
  page = 0;
  maximumPages = -1;
  idInspector=1;
  convocatorias=[];
  size=15;



  opciones=["Convocatoria","Trabajo Administrativo","Visita Escuela","Licencia"];


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



  // para el selectable del filtro
  tipoConvocatoria;
  tiposConvocatoria;

  constructor(
              private convocatoriaService: EventoServiceService,
              private authenticationService: AuthenticationService,
              private file:File,
              private fileOpener: FileOpener,
              private plt: Platform
            ) {
                this.url=""

                let currentUser = this.authenticationService.currentUserValue;
                this.idInspector= currentUser.id;
                this.tipoFiltro="Todos.";
                this.convocatoriaService.getEventos(this.size,this.page, this.idInspector)
                .subscribe(res  =>{
                             if(res!=null){
                              this.convocatorias=res.content;
                              this.maximumPages=res.totalPages-1;
                              this.page++;
                             }
                             else{
                               this.maximumPages=-1;
                             }
                            
                            }  
                           );

              this.convocatoriaService.getTipoEventos()
                      .subscribe(tipos => {
                        console.log("tipos",tipos);
                        this.tiposConvocatoria=tipos;
                        this.tiposConvocatoria.unshift({codigo: 0, descripcion: "Todos."})
                        }
                        );

  }

  ngOnInit() {
    this.url=""
  }



  loadConvocatorias(page, infiniteScroll? ) {

    console.log("llego page <= maximumPages",page <= this.maximumPages );
    if(page <= this.maximumPages){
      let currentUser = this.authenticationService.currentUserValue;
      this.idInspector= currentUser.id;
      if(this.filtroActivado ){
              let usrQuiereFiltroFecha = this.usuarioQuiereFiltrarPorFecha();
              if(usrQuiereFiltroFecha){
                this.cargarConvocatoriasDesdeHasta(page,infiniteScroll);
              }
              else{

                this.cargarConvocatorias(page, infiniteScroll);    
              }
      }
      else{
        this.cargarConvocatorias(page, infiniteScroll);
      }


    }
    
  }


  cargarConvocatoriasDesdeHasta(page,infiniteScroll?){
    console.log("cargar convocatorias desde hasta");
    let diaInicio = this.inicioFiltro.split("-");
    let formatoCorrectoInicio = diaInicio[0]+"/"+diaInicio[1]+"/"+diaInicio[2];

    let diaFin = this.finFiltro.split("-");
    let formatoCorrectoFin = diaFin[0]+"/"+diaFin[1]+"/"+diaFin[2];

    if(this.tipoFiltro=="Todos."){
          this.convocatoriaService.getEventosByDate(this.size,page,this.idInspector, formatoCorrectoInicio, formatoCorrectoFin)
          .subscribe(res  =>{
                      if(res!=null){
                        this.convocatorias=this.convocatorias.concat(res['content']);
                        this.page++;
                        this.maximumPages= res.totalPages-1;
        
                        if (infiniteScroll) {
                          infiniteScroll.target.complete();       
                          }   

                      }
                      else{
                        this.maximumPages=-1;
                      }
                                
                    });
    }
    else{
          this.convocatoriaService.getEventosByArticuloAndDate(this.size,page,this.idInspector, formatoCorrectoInicio, formatoCorrectoFin,this.tipoFiltro)
          .subscribe(res  =>{

                      if(res!=null){
                        this.convocatorias=this.convocatorias.concat(res['content']);
                        this.page++;
                        this.maximumPages= res.totalPages-1;
        
                        if (infiniteScroll) {
                          infiniteScroll.target.complete();       
                          }  


                      }
                      else{
                        this.maximumPages=-1;
                      }
                                
                    });

    }

    
  }



  cargarConvocatorias(page,infiniteScroll?){


    if(this.tipoFiltro=="Todos."){

             console.log("cargar convocatorias todas", this.tipoFiltro)

            this.convocatoriaService.getEventos(this.size,page, this.idInspector)
            .subscribe(res  =>{
                        if(res!=null){
                            console.log("resultados de cargar todas las convocatorias");
                            this.convocatorias=this.convocatorias.concat(res['content']);
                            this.page++;
                            this.maximumPages= res.totalPages-1;
                            
                            if (infiniteScroll) {
                              infiniteScroll.target.complete();       
                              }  
                        }
                        else{
                            this.maximumPages=-1;
                        }
                                  
            });

    }
    else{
           console.log("cargar convocatorias por tipo", this.tipoFiltro)
            this.convocatoriaService.getEventosByArticulo(this.size,page, this.idInspector, this.tipoFiltro)
            .subscribe(res  =>{
                        if(res!=null){
                          console.log("resultados de cargar por tipo", res);
                          this.convocatorias=this.convocatorias.concat(res['content']);
                          this.page++;
                          this.maximumPages= res.totalPages-1;
                          
                          if (infiniteScroll) {
                            infiniteScroll.target.complete();       
                            }  

                        }
                        else{
                          this.maximumPages=-1;
                        }
                                   
            });


    }

    

  }









  loadMore(infiniteScroll) {
    this.restInfScroll=infiniteScroll;
    this.loadConvocatorias(this.page,infiniteScroll);
    if (this.page >= this.maximumPages ) {
      infiniteScroll.target.disabled = true;
    }
  }


  filtrar(infiniteScroll?){
    console.log("filtrar");
      // reiniciar el infinit scroll
      if(this.restInfScroll!=null){
        this.restInfScroll.target.disabled=false;
      }
      

    if(!this.fechasNoValidas){

        this.filtroActivado=true;
        this.convocatorias = [];
        this.page=0;
        this.inicioFiltro=this.inicio;
        this.finFiltro=this.fin;

         // reiniciar el infinit scroll
         if(this.restInfScroll!=null){
          this.restInfScroll.target.disabled=false;
        }
        
        if(this.tipoConvocatoria){
          this.tipoFiltro=this.tipoConvocatoria.codigo;
          if(this.tipoFiltro==0){
            this.tipoFiltro="Todos."
          }
        }
        else{
          this.tipoFiltro="Todos.";
        }

        console.log("filtro tipo");




       
        
    
        let currentUser = this.authenticationService.currentUserValue;
        this.idInspector= currentUser.id;
        if(this.filtroActivado ){
                let usrQuiereFiltroFecha = this.usuarioQuiereFiltrarPorFecha();
                if(usrQuiereFiltroFecha){
                  this.cargarConvocatoriasDesdeHasta(this.page,infiniteScroll);
                }
                else{

                  this.cargarConvocatorias(this.page, infiniteScroll);    
                }
        }
        else{
          this.cargarConvocatorias(this.page, infiniteScroll);
        }



    }
    
      
  }


  /************************************************ */

  crearPDF(){
    let convocatoriasAllenar=[];
    let contenidoDelPDF=this.diseniarPDFcomoLoQuiereElUsuario();
    contenidoDelPDF.subscribe(res  =>{
      if(res!=null){
       convocatoriasAllenar=convocatoriasAllenar.concat(res['content']);
       console.log("convocatorias a llenar",convocatoriasAllenar);
       let contenidoArmadoParaElPDF=this.armarPDF(convocatoriasAllenar);
       this.abrirYdescargarPDF(contenidoArmadoParaElPDF);

      }
      else{
        console.log("convocatorias a llenar",convocatoriasAllenar);
        let contenidoArmadoParaElPDF=this.armarPDF(convocatoriasAllenar);
        this.abrirYdescargarPDF(contenidoArmadoParaElPDF);
       

      }
   });
    

  }


  diseniarPDFcomoLoQuiereElUsuario(){
    // funcion que va a recolectar todos los datos del cliente
    let formatoCorrectoFin, formatoCorrectoInicio;
    if(this.inicioFiltro && this.finFiltro){
         let diaInicio = this.inicioFiltro.split("-");
         formatoCorrectoInicio = diaInicio[0]+"/"+diaInicio[1]+"/"+diaInicio[2];
     
         let diaFin = this.finFiltro.split("-");
         formatoCorrectoFin = diaFin[0]+"/"+diaFin[1]+"/"+diaFin[2];
    }


   

    let filtrado=null;
    if(this.tipoFiltro!="Todos."){
      filtrado=this.tipoFiltro;
    }
    console.log("filtrado",filtrado );
  
    return this.convocatoriaService.getEventosBySize(this.idInspector, formatoCorrectoInicio, formatoCorrectoFin, filtrado, 100,0)
   


    
  }

  armarPDF(convocatoriasAllenar: Array<Evento>){

    let contenidoArmadoDelPDF=[];
    let currentUser = this.authenticationService.currentUserValue;
    let inspector= currentUser.nombre+" "+currentUser.apellido;
    var diaDeHoy = new Date();
    var diaDeHoyFormatoPDF = diaDeHoy.getDate()+"/"+(diaDeHoy.getMonth()+1)+"/"+diaDeHoy.getFullYear();

    convocatoriasAllenar.forEach(convocatoria => {
      console.log(convocatoria);
      let contenidoDeLaLicencia=[];
      var formatoInicio=this.formatoHoraPDF(convocatoria.inicio);
      var formatoFin=this.formatoHoraPDF(convocatoria.fin);
      contenidoDeLaLicencia.push(formatoInicio, formatoFin, convocatoria.tipoEvento.descripcion, convocatoria.distrito.descripcion, convocatoria.lugar);
      contenidoArmadoDelPDF.push(contenidoDeLaLicencia);
    });

    contenidoArmadoDelPDF.unshift(["Inicio","Fin", "Tipo de convocatoria", "Distrito", "Lugar"]);

    var docDefinition  = {
      pageOrientation: 'landscape',
      footer: function(currentPage, pageCount) {
        return {
            margin:10,
            columns: [
            {
                fontSize: 9,
                text:[
                {
                text: '--------------------------------------------------------------------------' +
                '\n',
                margin: [0, 20]
                },
                {
                text: 'Plataforma supervisiva ' + currentPage.toString() + ' de ' + pageCount,
                }
                ],
                alignment: 'center'
            }
            ]
        };
  
      },
    
      content: [
          {
                image: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAEXCAIAAAD+4q2vAAA3XElEQVR42uzdP2icdRzH8U5GFxUFQV0URwU3RQcHraNKR110c3AQ1El0UXFx0c1VaGltIEI0RlJN0PSapD177dkzmhqTmDMpXv7epUl7/x5/CoJTCW3au+v39eIz3R0Pt73hnt/D7csAILB9GQAEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEAIQmhACEJoQAhCaEPabZ2l5e/y4/++ZI8ZnPT9x9cPyWg+N9h3N3fPnjo/nZN5bWv603NzMAhPCmVNuZPTP/7sjZp784+VCKX6rg/9aXXkxvTZ1/7cLG9xkAQngzaTS3KtXJU7+9fiR3Z8relTdWOlBeHbp4aTEDQAh7XztVcGltZPTc8ylyu1z/xL0//fFhbWeu3W6kK2QACGGPajRr0+VPvjnz1H93BHe7gZMPjpVemL3wWQaAEPaoldqp03NvD+YfTmG7un1dePzswnurtdMZAELYQ+rN6sbF6R+mX0wxu/blfn2lUp263Fhrt5sZAELY5dpZa75ydKjw2JETd+1JCNN1hgtP/Fz+ePvycgaAEHazrZ350uJHw4UnU8D2doP5RyZmXl1eH80AEMIuVG9WK9XJwtw7/ZP3pW5dp42ee26hMvDPgdKslQGEJ4Rd5M+14WPF/f/+HNp3/UJ46Pht/ZP3p9ymFmYA4QlhV6g3NmaWPk3PSBzO3Z5adQM2MPXA+PRL5dWvMoDYhLDDWu36Si1fXHg/3cBLfbrBO1Z8NgV4c3smA4hKCDup1br012bu+C8vHxq/NWWpU8v//lZ1+3z6MhlAPELYSeXVoXR05ejEPalGHVy6ZThWOrC4MpgBxCOEe/C/SOlB9XpzczdrNLfSh9e3ivOV/uLCB+loTDq6klLUDRsp7i/9zd65xjR1hnH8o8kuWZa4ZN+2LFmyr/u2j0uW3bIv+zyveAFEp6BGud80M07d8AJIDOq8AAVaUES5FNHRllsocrXQllru0hZaWiiclr77Q53BFkpbKz1tn1+eNA2cc3rOe948//d53+c5Z+S82apmBEEQkQQJoT84HHYr99I414cXHqkmbyrGcgcnCrwx5UQhNkYxH56axhP9W214tZNckzRrVdE0KUEQkQMJoT9YFoYRzz3o+Lq0+VNB8ycC2VYvzbkxXqV0V/IeT8TvTdtSIvtY3POTwdzBCIIgIgMSQp+ZtnTh0Z0V7V/yQ7oCbxBpcc8PyCZd4KYYQRBEuENC6BumeUWLMpYnivVOrbL9KzzpDQ/+RoEHIwiCCF9ICH3CgRlR5xQiT+TqnRre7isb3Kc3t9OrfQmCCGNICH3AbB2SDkTxRKU2TQvrur8bMVQxgiCIMIWE0AemTBLU2/FEojbTUObxYkqwYNMzgiCIsIOE0AcmjU8a+37liThtsiE/VjlxDUUjtGRIEESYQULoA6gajMyIEIaHwAlbP5NrEvEwNkYQBBFGkBCSEPpg0MI21WHjXD8jCIIIF0gISQh9M7woClr40tTE2WcZQRBE6ENCSELoq20pkrzf0PPz2HQtIwiCCH1ICEkI/TE8Ja6h9xetrpzxAIfD0dfbd6/yngerrFj+rK8Ty6Sy/v5+k4nC2dBmcXGxo6Pj1q07+XlXb/1zu6Wl1WKxeNlbzGaLWNyQk3PJaQ3ixxxnY0QEQ0JIQui/1XZ9q9UJF20zLHhwHCeRSM+duxAbE3cgNs756W4x0QfweTTheFpqxoXzf5UUCxobnygUA1arlREhhd1uN84YoWSnT/2x7bcdTsvMyCovF46NjrGNmJ+fr6urP37sxOt98b22pg7HZESkQkJIQvhW9rDzG61OtORYZMEAo3udTnfyRCLcmR8G79na2ob4wOGgR+eEDIjmEdnHH0lwv6HQwrm5Oc8dZnx8PCkxxWXH/ftinj3rom4QsZAQkhC+lRVJP6xDub2ujAUD5/zYoYOH/RPC3bv2HE049vTpvwgyGBEiDA8PJyUm79i+y/2GpqdltLW1b9Rh5Id/j3fZceeO3QgKESwyIiIhISQhDECJYX3391gv3Pw5UkxsQsbi4g7Bl/ltqanpcnknI0IBjuOamiTrj2yirhfewLDGgxC2NLdg/tx935qaWvyXEREJCSEJYcDmSEcN1Zv83BkIoVQqc48It2/buW9vNNYFo/fHwmKiYzH3FbV773oONC8vH06QZsb4D1YBCwuvexjWZGedmpiYWFpaYmuBvw8ODCKgRA9ZvRekkQZDkQwJIQlhYKxI8kGr8qDZqmYuBEMId+2Muphzqbio5MaNmzDkFhYUXMvKzIb7W8d7noZ/pICA/2BNNyU5zYMQJp5MRmKwh5VCs9l85/ZdDIxWx5GXLl4eGxtnRKRCQkhCGDATtX4u1yTb7GbmJHhCuHfPfsyATU5Ojq4AH6fVDvf19SNR/lT2aXfvibzBx48bkTXDCH4jEJR5iOxhmAC4ml8wNaXzkC8zMjJa86jmyuXcM2fO5vx9saKiUq1W0zAokiEhJCEMpInavkDiDGc3MRA8IcR4f71MeiQc4r8uoWFC/LH796qMRqPLNBqcozcVZgsLC9jSy4wbjuPwQ0h21esNer1+enoaMYrX+9pwyS7zftjXZDLB9eOA+MR3X+d4ET/NzMw4zwefOCX8iq/pu9gFFQjOg+DqDAYDBhY2my2AGcI4T+jWhou+8UeOqpSqDWswFAqFTNbc3d3jEj66dQDOpcHxx5Xm0jtb28O9w464uWgK/SsMaCLs7uuFz87OrnQY8OpQFgulOpMQrgUJIR+sWPqRuOfHaUsXA8ETQiwQDqmH2Fqg9B5zpMgXXb096gurqx/Cqa3WBmQnovR+YGAQwsDWB14JzrS3t/fFCy0c1oYe7flzBRIUS0vLhOWistJylPkj32doSONZe+BS4XxxMp2dzxDdsv+B0uB3UVRXUiLAATEbjO+IeOC+mXdgRQ3R88PqRyJhBc5HKBRVVT1ALi7cN/MOnANibmRjIt8E54AaBlwdwixJk1SlUqPaISAuG6ONTnlnZma2N8nAuCLmEYxFlEol7i9qSaExa3YtrVbbv8zz1+2JC8FpYGoBvQWXiWrU+nqxRqNx13tsiVEL7hRuboWoEg1bVrbctmgidBX0NNxQL1UQUxqoeUUojF909hl8gYSjzXGSJIckhG9AQsgTE8i2jujvM8b4KYRwW4gqMHfqEkNAkDBad8YKGOkXFRVnpGdhOSo1JS0vNx8ueE2hgizlXslLTkpJSU5NT8+EZ3SqqTuQK7jCP8+ewzFRs/Efe/f2a0dVxwH80cRE/wQTE42J+oBPPuuLf4IvRqPxgTtBLGAAX6TQUgoGK7dyaUsLahSkLVSIQC8g0J5G2oLWAnI5WnqKCoZiS0/b8RNWMxnWmr3P7HP2Zk/I75eVk/acmTWz1pr8vuv7u62LLrzk4osu8fOSiy9lmBX3f9Pqm7dufWSQTe/ZZ59j1PUyAj3Eg6ilAoDxHoVRZENe9qNlJkGHfvo3tLjj9jsPHHhxODGVaSDwhH9UIiZOLKkgvZUUPZ62a3+2nGMVIg5hPP60+/ndQo104hbjcnsal96WLbtC+YLly683gTt37lqi5dke4t571ol7ytbakLNfyqzYtPH+I0fmBr2zLc7GjZvMmyXW1q69+7XXXjchTT8i7HGBxdKuW75iZmavCfcZMKhaax9Mmm1bqOXXXrdt2x+aaOobAJC33XaHT8LiponV3GKK3H79dSvWrdtgSzTs9NOjR1kpbr7p517jssvOrq+W+rl82ZV+v3LFDUaqn4DDAMKzEkDYn3bwn788ffpERaZnGqXsqjbZ98I++dTiI5rXQ4JdO3elGl30NQdSlpIBpVilsq06zvSLW9Y0raxQLfWTURmQAy2yqP2yuR0yYVEZF3zr8Ftif8o8geyXWbtx1Wo4jZe0xl6igAB1QXalegudTimXTAVDRW27dKLR/rYayE3Cm0WISSgrJwgMvn/TA1x9WcywK4XVDKos8+tf/YYrsckghVPBufoaEaRZSI7SRTYfELF1dDYfM3tm0r3IvVeyCciuKeO5VDhSGa5cICsOmHUC8xac2B98/4f6wTujRlIAIQkg7EuTVnjgzRUfzIONaQbLMHlxxgAhkv7hYqwCaSu1CQXH/JWoj6396htvzmynMExFkoxYMJEhUhkAg0Yw0yRebIZJLXZsyNzc3BxtWBseZc61hkp2gTH2PV01lSxL730bNnrVjp2YXlZTdwG/pmmRlU/Vuu4v42ImU/0srqwacAJ7GfPDki0ca2EGhH5651aexFSLwWfvhrQ1TQiQssSt4aNTts3joCkLQfc5sSfbt2+/j7O5QL40BVQhXPd+lv34cmbzqAsRQBhA2KO2/41rT8z/a4pAKLCQH8V2e8f2HRq7nJ94HmLXSsvoHRvzpDfpMvbGLDTxgvMvwkiyiAmGMpax7LmsXrCnaTtlqEwEtGMDUeIeKccaCI2R7XQRQOi1+epAexPAMDwMJqFFlwZvDJNTqqmvjR1/7d5Jmhw7DFq+Gl3YOTlBWbybHWLtLJzmBwiVj7tr7d1e2JqWQMiuWPKqQ4derq9Zv37DqFPNdm3Tw8p63rkXdL/Lh4G8CtupH80+j6yff96FI82tr9r8mKUqJIAwgLAn7e9zG0+dPj5FIKS7+WZ4aFjkNHTKT7vmVuXCiSXapRn8IquMZsxYUQaElCyqB1GyMA0chV2rDqxg4GqFBOjIValdcflPWkkYxcpIm4AQCBnLEOOYDgdhmIE3nYX8SVjIIKVMiQ/qyrjcW1sXnebRmroAsPmujM6cQ/SMqPF4pWkcVewnAIZCaM0OzUkaGrMkp11WdI2PU6ALcCqBEEEvCR9GVV/DGTlqcSIWCKmoZqA1OYf18pZb1pjD5JzOmkCYOjQJKK5cuar8YAzw6quuMbdmmJ/YomcXiN+JuuEBhAGEvWiOKtyy95z/HHuhIlMCwu6N+sN1kndnVCDECBnrAGGmj4ROiItJRlG61X8zMKArMU4eLHipCfKkJf0yw7ZVN9zI2zQcCAWJUIvcinffdY8HoREJKrInciDV2RdocdkP7SzURWgMVoHTwLDEvbImdiMRrNnZWZEgpXXRm8Bv4TN8onylnGpss2DAi2lgQLImHFpE4sS2ttdes+ZWkJze58471lrNbMkEkoj+7cIILdyhBhCuu3e9X7ZOlLgVgGSK7KusviYIme1a4FJpULWOMPLRR7eJUGXCFXkEYsty4Tqsw1yttT4zULfKcM4pK+ZWuYCnnnyKh9gngZTbuxgp7NR/FRJAGEDYh/bQ7i+8OLvyfx8cNl39B0K2NdGhLIeTAEIq+OGHN3MiZtArhJJaBG88OgReYgMrinAPT8RThwMhd5QQHpOAegqmF/HBFlpe9sQTT9YGRpBZXuDpMsq9sEGBFipVOGJ5mUBHF6QUlPIC5lzOUaDFy5WG5mJOWaMwyfI6HO9Q25+7SyLWasGU76Pb1Js5NEaTn80h/sQUPC4gtMmAN7ipidItugnYWAXsV4yLrVjobGZyEJJq7UxpmhBLaSyyKcqeRRSnR0O7kt0afppYoh+PSytu1IzDmzdv8fJxpGIAYUUCCPvQnFx/7MSb6VSm/gMh9SduQnYXnTJ2IGTY5GpC9TJKAUWqQnjyMt8SVYjJJSBEs0ogxGURrCyusrVuDtKZLpASh2hmfwXV2Eb2PtxU2EYZhpqsvjCgBEKcEvC7APhlSjkllS+udAvVzyRbPg5aNIcPCcpNgKhLoShgcixAiNtBqTo4MyE9SWAsadJMZkAoOKgqxOyxzWbcHaNNf8WkvbbVz4K52C3E7sJgj2vuEqRqGFGEyQQQnpUAwqm33z3/uZdmV1eZTKnoNncd1KHgUhviSGO1g0MpsGKMQEg/QY4sTEa3KIJcRqEZqRFWNWSuPENDvkFiEq1AKKFNP9mE0OBlYI7Ccumvgoa4DEt4KxPaDuw/wHVaHt9IHZslGlloa6trU0YHgyTSA1y9NsJkjFBwKQVlmBxLkFt7512SMerLBKMaiPnPfJaMvRj/WIDQL4ekQtoElBWLGIfl1FviermttZwTblq2gSw/J1lx2UjlGgLC7PUYY4X/GI4HAUs2UhjPJmw4VUgAYS0BhFNvTx/83jvHDlS1TA8IbbfFa1AuEthToyX9dKU/tZ7QS0mhDmMEQqoZaSujV0TH4G2MZql5Tz/1Xx6wJ9ODVQ0leq4NCOnEMhVBURjMchAQcvLJxc7+yjVIn2b9CNkQ2JJdKTseiifywRzXJazRNXxprKZsiNIrjWURldtKSNY4O1NZuyRMxKquYLFlEK+xjAUIIVA1WNR2L28x28211phPeRnt0sxMxvl8Nom1G6+vtEsGoY+N1ZSNIc5OCSA8KwGEU28vvP7TLFh0inmEcidE6vNapcb46ae9eauTTKBHqjU6aSDUUAGXUYXNVqKgxq+GJQwCQqyLyXEkIJRSUmaPiGuVGp/1g8egXGWy2uOPPZ7MniqtYNJd7M90uqAe9yKRKOxIRjyTDBjKPHoN71Qbwcxo6BGShDia8PI0LvbMyQNhe6CpsWdr7b9+We4hAKHJsda2PjC+u23fKiCLTBrHjkXJ+ADCqgognHr72+HbqkymV1lGCc2qTfADLIEGyRQK55lbxguE9v5+uegGCJHUQUAogaHUfeBc3vogIOSyKuP7ZaOX/ZgETy8tn6DUwNPokMI6FKgjIorusR2pOounwPvWCCAuSeCBymviNhFroZUQt3Ua7RiWDoQmvCoku2XRDVOsSzrYtDFm2Mx1v91CqM8X6RMBhFUA4dTbq0fWV5n0r9YopS+jvGQzyAQaNAwI3xoZCP21NBW6Bk4v2FRRUbolBWW0M8KHMMIxAGFrfVQlT1GuMvZEuRbYXCdj6JBDS58Z0RnShP53j29UbU75tAQJi24CbRgPWQ4nCYTtplEU0OQsuNauEUvsg7HpqRNvJKj46tLcdplYVg00fX4+YkcDCAMIpwuEcxuqhvQTCAEYXGklkW4ZAoTKnuWVZYYCoQgRkY0lK5KrwIyWkv9aG5skrSqWFUWo0yfGAoRlcZYUmp+VUSU8phLAsyuZ4CTM1aoWtHgBGKMHbi3016QtSArlKabKO13ESuUwMHqzRiy6kwZCiX3lLVbNfmLIWot/8dME+pagYD2xsNDuRMKJYnjIoo+zC+G2+gh3FRJAGEA4xfbS7Kpm4kQ/gZDXjQ+GI60EQglhg4CQdU6HGRBKKRsChDyOMI9HMLtg+/YdMBXIzX5UqDA8jLuOgQs58A9ccLxAiArz1WV/Ndjy9L79ddRokT9Qcg5vi8EIEPVX1c40VlOERlhQFsLKFcqkCd6qDmJ0LLHuWmJDy6Tem8yJAiETLuaaYbZ+rGO51n7j1Gjz5iNxgT3ToJLZ9ii8pJLopQyaWPZPDF7wkSFAvtJvyvJfhQQQBhBONWr0u+++/5cqkyn5COtIyNKeyR0I58rgxto0Kgcgu4CFig4Cos2jdqh7jx6SRygD3Y3ZBWBpUIBfSq6X9l6fazheIFQl3NjLAmAAMuvHLTC+rLIG+yFKGr6dAfCA362mTqOQrSFOsiwUwDpadRBcMxUbW3qTLQp4vPnkgFDSZ5lHKD6oDGhqfkJmCRzWIE382zegvgGzsI1R/afmBdJXJOCzN5Tk3mGHVUgAYQDhFNvWvV975cg9VS1TZYQp9TsTSADk0JRSD8qvEA4ziBG6hU6XXdfM4PYbbGNIZRmEhucmo0SUcirqlgn1x4J304fnz0krBDMAZrxAKAqDai7dlthb0y5HNftNaZB0kpScPBekSi4qXiLKWK+j+waFabDsFdkjVxpO1UHsPFJu5dIbsy2ggkmTA0KRq9JLTFoZXlRuFPzGloKVWIyPensocqoVR1gLWMXNkg2KxZKL2XqAvv2cL61khL7wKiSAMIBwusfT7zr4nZOnssiL6eQR8qyo4dlsoI5xD0VrzfeSeFCnT8hVZ+Yqg1yEKUpyp8fFjFBDmfsqA0Ls0/a8PK4PptKYyoNRnWpGcw7pUNllXA0J81wvb7OPTcKt8QKhV/LmrSUFBGvANgitqifvYGtqBOufl0laWBFRY09DVifFy4s+3bNnRg4AW5+ZZG5VnibL3zc08yPtocu5S44EAZxl+n/K0x/UpKtb+mwfY1bFYTISTA4IxVKVGRTe31IaiCI4CK61lk8J4EXP+hSlspgQmzbElzsw9aMQQb15EjDFkgwpzbx7GVRhOWOpDRmMLM37QNcxnFVIAGEA4XTbg7s/f+jw7R8bFgJCfqkEhEtpcu2VKbFPTwYrCmXQmag4CkyiwgbldUEIQJiolW2+2iKDrhT077lccTosY1goa7W4xguEhCKu9Wz5RMZP9r1BpAr+pU6gKWgpzdEQiDcOC2Sjk4/fiqZ2AOUxvyVh4q9FuMvbRdIuWJINFtrZlK8HigYBod0JN+fwEFATPhy5EbtBUS0Ynr2CtfZ5lO9mMqFjso07z7L1KEf3Aj+z593k/3hQ+UWh5pFNGEAYQNiH9qnNM1954+0H50+9d6Y6XU1Y1EUTR7AUIERroBo6mDqsmZxDfBZXvJTCSkCYxCkTYkZs/EeN7wAqQjfHDoQsb9gnk6aBd58ifdoc1ADmOAU9jDo56BESwyRYLSR4j/qovLbZa2BIaPSCxWjMf2KiWcO6ymOYyvMIuzPCkhRib2lPM1IDjcabzOnspYv78HyxhlCFBBAGEPbkJCZY+OLsDR/DIfVAgmYsVf9Ip+BKuAYPWVkvTG5x+kjeWzM9gGrjnfKUUfsRicNXl8aoB57F0g6WYmqawr1UKmLRhs0ZU3CHo7Q7EAp8ZSxlV3RvXbyblXjUybFMsKRL3VHj4i4tz3q0yegSFWnOcabyBVgXE+MvD0KylxKfUh7M272yTJpbtDKt1EjN9ALvRGc9ZXEnMKv6beBVSABhAGF/2u/3fGn3Kxe/dvSBicIh0BIUk06aHbXRhs7F5ZJpPSqWWuTaweSGqHWZ2iylmY1LjjkvTqaXGeuoZr11oV/cijyRdZSjn8JZne2eXSnUszzPgf+MVyl7JW7UsrwO0sP820XDypCj37MRcQcKKUqBi12aNUoo2KUkpnGpA47VZQOBjvhcl6/CsmZLowyps3NTRQX7gGwtxCg1j87HzzLKq7esVNuQqBn2YWbhjlE8zp1gs63LFHDysTzzaHbf3jG3Iv3vvRdG0QDCKoCwj23zzFdfnbvv5Py7E3UTMhLK9abp6OWF2qUqyFDKYi7o5ZQ4OEgkBtBogvfoRLW7MBINt2Pf40gT2IkYSeoSPMm4ymoHV+hT5UxLfCLiYsTgUHzIBx0nZkdvXFP0u9vpTe+WIiNaY0pFW6jh4kZv4kHCK8rkPyKqU+1pXblStx4nPV8AS2uCmhB8YONiT/f+aCjy5308whjNp/hVdlQbhUHzg77QwqibV3KLQaVO/PRv/Zg672ATIGViJL5iDlPtUN2mIZsZm4OO2yNXWiDeUJOgYWk+EpOT/HAqsPDYpVFDOESTgb0JJMJSRGC6PU2jmfff7iffSopgZlDyre6B6bWeFiMyHJNm6hiZQXvrPsxBg1dfdY1Hpw8mfYGpeKnX9hsGVVZ3nxxrcxUSQPihBBD2sW16+tOP7fvGG2//9syZU5MjhbCQ4qDLHIw+vCFMIlDEhdJ67hpeANpf6W6H3VD3PDf0GkedeD8KWnSihAGmMBfQqmJDRAyiEbDBXV6pNQCEUQ5M0n3qXOMBYkcpaOGszLBIgHdjfmQVpKnLHjxIrCD1qhCJ7T93nQe1hopAOF25UrdsqgI4B11pBmCD6uSsrEIwBO9AYhCrEooQUDySxTgdKjtofvTAfmtDgJ6iwhK9KXed+AmA9bN1yyMm3KDS8QijLitnLSQ2+ay7XqZ7/TDvxmO3Y/sOcKIZo94Mua7bgnHaBzCBCsiUcpC9ntvl8LndSplGE25Wy3kY/uV4AYV4hLd4AZZk8TIQ11kf5laH6Kmp4+T2VoPm1uqobIDdWk2T4POzM+AL9NpezN4ifTBxJG8AYS0BhD1tDzzz2Z1//fbxk3PVhIXKPrGQUC703ahuSAY9bIBCp/H5/2jk5lmvuqXyQCCVVHUQCIqvUGG6YxMD4YxysNm7LaheUQ3RrQs+SFeu1C2870KpKX2pGuylgAdUe4TfmM/uoIXWwGZmPUZUnfhpxghdP+qEl8njurKHqEYXVlBLQ4ylXFZjTDPv34Nut1KuWfSZf+BQD15AbgaTgJ/W3XOtoGnpOAPSUaymSfD52ZZBUK+kWyFFVUgA4UclgLC/jb/w6H//dOZM7FtDQkL6KAGEAYQTbw/PfPnDqJl3qpCQkJD+SQBhAOHHkWUvm+L9E/+oQkJCQvonAYQBhBNvD+354sHDtx4/ebQKCQkJ6Z8EEAYQTrxt2XuOqTt9+kQVEhIS0j8JIAwgnHh79M9fP3b8ddGFVUhISEj/JIAwgHDi7Y8HvjV/KkK9Q0JCeioBhAGEk233P/OZ514+18n1VUhISEgvJYAwgHDiSYQvza4OIAwJCemtBBAGEE62Pb7vm7P/3jK5bHrFsVIZKgcvKB86qKmk5afT7FTyVJWj+qRIKgZm+M7/Uxl1185dyqBU/RNnGaou5iXVolPerAoJ6ZP8n717i7HqOg84/pjeVFWqekurVlWrVFXVp761aqWqL33uQx8SJTa+JA6+JLEDJjZg8B1jbOIkJnhMjB2MuZqLwRCMMdiYGe53zMzY4DH2DCY4mARjwDA7P2nFS9v7zNlzZjLnzB5nfVpCzNl7r732OtL+n++eQJhA2NzR3nX9uQs9zetN6L2vmLUqxsoZq25cb6hT7F91t/X58y5WBPLddz8PeY2Kh2lVEftIKF6qHU9WJYFqvzx8R5YXhv0PpTuzJEmqIQmECYRNLbr9+1Lps2aKV6o+CcNoEqt6tdqY6kz294/hcFaVSwvtinSPyqok6m2qh55vDqWpgrLgFy8ma3mSqkgCYQJhEzv0rtr5z1pPZM0UFbFDV7yhDjqiZkyaGY1p1URFZn2OPgPCOXOzKonS1ZpgaJsQV6h5EBPuhQsprzRJVSSBMIGwWWPR63/y2htf+eBXe5oNwvxLdsJ3J+phq+W3trFx+JN3ShMceommbvkuuLrc0QuzMSswo/EeqIcn0ijx5Zc3ZVUSnTrs8A8e+2Hc9sd/NEcThjH9+yPJ50wSCBMImzWWdnxRZbULl061EoT8Txob6ZR08qTxG9HKR5skPY+0t0U+zkIIjJdoH+9lnY1NgROY0TNv4oRJTI6rV7+giV1WPdG1UUN/i3zggRnilbIkSaokCYQJhM1LnPiS7kvCZFoJwkWLFnObXR5I0I45ji6iqel11349b0vUwz0bm8LBGdrAasCraZ/mgtXUtHgENeGzSP8m72CSqkkCYQJhk9TBv5ZHf/5iX0ZaCELtv1EhKxXYEzv6ta9eHS4RbKIbe5YkSZLfVUkgTCBsyli/77/6zmy6fOXjFoNw8eKldI5Bm84vXrRk/PibwiU3jr9ZHl5ex6Ky1LriNFtnYg3q5qBeMcoZEyWhA5ltUG3pypUrjauAly59MuBDxYU1ctQdtTgXcxseypzDUPLsiSxGX4EkFtp2I5c0GGhqzrCBVujPLEmSBMKKSAJh42Pr0avUF/XeriAI2Q9feWXz9ybdGS755g03vvDCmnhIfiFvomnzGRpbt74uXe/ZBQvXrVvPB1nvpQ8nwHDkyBsbN768ZMlSi9mw4SWzcVjWc0Oi0ZEjR3p6ehp83Z848W5nZ5eT81kfgPTmm2/RdAecxPoFx779do+nCyi1GHfcsnnL88tXLFz4nDoD5iwlWe2yzx08cHDNmrXPLVy0YsXKlzduUtbg9OnT5dmEntQ5BSQXfoI4bceOnQog2EDDCnds39HX1+fQmE50SVJlSSBMIGxKS/ruvrawaRUEoTe+hPo775jyKQjHRxDKeJs6dZq0dIGmu3fvlq7+4ovrpk+7WzDqLTd/m+4oVWPy5KkzZsx0Zm3xlB/98PFp0+5ma7Wkm268xbj1O7eZbdpd0596an53d3fhEvB4/PE5Tpg65a4NP9swaIAo8Nx7z31WPuvhR4AtAIZKB2YiZaZMvkvgD+UsD+Zjbx2bN+8n4ejBg4dA8aUNGx+Z9ag7yru45eZveSixpk6Y+dDDsB0uL5H9+w88/fQzluGXxLe/9R2X2xnP+71Jdzxw/4NU7bCwgsiXuPee+z2pzezo2J7VCJDDnjXYq9snTrKwsIH+I8TGhw6pDVTNUKAkY10SCBMIR37sPna7vkt2rJogpFvQYLxewyVK0qxe9UL4HK7Ch+Ouvnb2o99ftmx5nLwwsEQOX9BR2D9f2fTKfffeX5K2ePVV40xICaO9xZUAW0znwDbzlNhIqaoIESfcu2dvWDMAY1JcFYU1b2N0x5hn+f3Zj8m1APV6i3Ro6dJldLIBdS+MpBn7EeBZ6s1gM1V6o8PRPvOTzP3xE/EcwUqFmamA1haSQEoGLs5/6mm/J7IkSRIIB5QEwoqUktGP/v0PXw07Vk0QOsG72Fs1vl5pY2EqKW6fptvfwGQasiyu+tq4a6+53kDHGGJDvzl27HgwM0rdA4C4Buc4M1yCc2GSyFcqZjRgUs5oPLE6GszgRz3T4s6du66/7huxMg7LZNBuMZg2Fj6//74H9+7dl1ci6YgTJtwer4oJlLkVjsuv8Jpx11G80LrWMWl5YarCJC7J74whX1OORP5ZaNjxKAtz4eloe/miP2YT1usrsKu1K4RM35RfDFmSJAmEBUkgrMJY1vE3e45PUlw07Fg1Qch2500dX9wy29gMw1Tqk8XXccQGfUs9tifb5tG3YlXPBT99ljYWTIU4lMeAc6h3bU886ZIHH5hB0cnD47u3TaQAuZDs3r3nnrvvDYe88WFY3Eo2kNDS2D+dE05mjTx69GgA4ebNW6wwPsv+ffvzIMT4qPvGMf6bNz00YyaT6RNz2xg5TZtfIXOuSQq+T05ERQn8Johnuspj0qFpe7TAuDOG0zwXm22cQUJ9iUZo2Xm1Tw0EJlZJn0y1VEB20XwZBBbdl17aSHvOkiRJICxIAmE1evD+79nzR2PTpdaDcNWq1SUni2RRk9p7FrfyCkpgpzgOOYU+yb/rwUwyuKT1np53wECiBTvq+nXrjx9/O5T6/OkzC/IK38yZs9hdUUo0iksOHz7ibc4oGpU5w8vdHalZFC+Jj/FzD1KvFDhDKJ6FZSMrhokfCSBk/KRNhhlwF5jzIHT3PAgtA8+sUESPh/KbgGYpDZ/rzuLz25iP7nEXwItaLywp00Od9ZiCd2wFe6ydsbG0t8hCh+IMim6XgNCX4qcGoOIf963QHiUROGiF5JgElXklwTv8NLFOv0jGdD2gJFWTBMIEwhEbK3b8Q2fvnCwnrQehl6k3u8iLwujq6ua4WvTcYvpEXvsR69HR3hGsfzAJhJ/VeB7t6+0riYRkABRcE72A7KVgmdUII6pAkmjfQx24ChkLZvBmD4fYA5kfB4zefHHtOifExEcqrNOGAUIn1PrYmBkFsOR9h3TT997rjXZR+mh+3+6efg/HZFYj4GQDuSSVQccqPyxKQVi0VwvkyeoILv5k3lNBc7VX7Mmpl1OSBMIBJIFw1Mee43dcuFQI6ms1CKM/r3ZwZVFlosHTUGtNpCILXoBBAYQiU7Zta8eSknxBwf3RJHjbrRP4/9BxQGRqlxg1KlGa1Eoaj0N0Kaa/oEhZIQKJ8yz45zjbnsnpnayaQaEcKggR14JrV2gqbkt2zngLRGe2jbFFbLmMsfEoDTJOUgCqACJ3ZLqUMeKcBkFoAcTl9RIkHOrq7Iqpn1joMbMkSRIIC5JAOLqNJrYc+f+f/7Ija7lEEA51eKuiIF3H+3pAEHKeSfIryV1DCKVN0SVGbJYENNJTKYUxEodBNSCWGsQ6ajEhygZWUaeQC88uqhROvJazMKxqqCC8a+p0OSH1cvgsQ3xQ1Fkp0DFJEbYdCiuk7YV4nHoSir1lQUpAOPTGkzGwyNjHi5kkSQJhQRIIRzFSdP2+/1RHptY1WEEQUg0pZDQebjDki/PUgpBjb9B8RLbTaPDkRbOYrI6wEyqNHY2o1C9v9kBTllu5ifG+csnNHFGH03yKfHsxLvTQoUMZGToI+fDoVfVKz2zKRZ8KdYmlsXt7e+mjABx0SjgPGRrlMmwQWgmOUtNPUio/FbsnGZ+bME6yP4EwSQJhrSQQjmL6/JF3H7185XzWaimCMKYu1BscXY88Mlv6vGYUWZA6IIQ3YTKDVqiZfOeUeGucEztTkrPBQ5kPfWRFzGcXuGMEsPAT64lGSxmK+bBY7BweCGEbTur5OzXLpTLWgtBexUgZPBb/KcRmxEFoAZ5LvrwVqssjakYQk7I1YbDo+jr8iEkgTJJAWCYJhKOYPv/xpfezEmkhCH88Zy4SdNcRb3DBL2x3XrvlIBS3wlQ4JBB6X3P7DQ+EMvejuoNq6rCEFWKDuNN89l5oNzhaIGQgxXt7OOIgVIhOLocFWK2CNWzFNsS/YcipCM2zEgiTJBCWSQJh68fibX/a3vWNMx8dyupKtdIn8lIOQq9d4S2DgpBJs6Crlbi4kDJfwyUPQkGt8i5ihgPtJ0xFQ3KVInAhaQEnZCw0CYQig0TAloMQk+hqbJUjCEI7L/VCt8KQpFg+EgiTJBCWSQJhi8fS9r/a1nnNuQuDpHNVMKG+ERByiSk2NiQQUvhohA2CUFp9HoRMoOq5xIhWdUFDmqBkjMl3TuFTDNqYkt+uGkUQWgN/4QhqhO6rVrjCp/nSNp/WL73NNxuHIB127wTCJAmEZZJA2OKxreu68xd7+/vL2vd87kEYK3cbCBGiJet1mSjkzhfKmKniLVM+WP8wILRIRKNYYExAqXxE62wxCOX4C46NPkIJHioFjBQI7bkg2FjuzpNKDvFE1ilW5oOcHD3aOX58CpZJkkBYKgmELQwT/YOO7vG/OLcvG0w+9yAUfZqvF4NtJVGjyqPEZEelqwt9HqQPso7Sh0LpapUBfKJBUgx2FfOJphlpLQhFjfILxqhRtxDmOlIgVERGvmZQ9Tw7m7CSNwM2k/Ls0icSCJMkEJZJAmFrMiVW7vynbZ3Xnj3flVVDRhGE3HjUo2ivmz37sZK8Al5Atc1iiwbqI0oVomkkMAR3oDnVZ0HWyA+0UFPUHVsPQjvMbBvzCO22nMjy/AdFcxoEoVSQuIGevSQRk7s0X870gDUkSZJAWJAEwtZkShw68dD5iyezrCotUkcRhCrLSMmP9jq8UcMzqyNKaMYsPQ4w+QC1eg9vnBzHaCRkMDRiNRmUxZjWg9AtHKKNxYVBcr2sfF5Siiye8WU2UllGrTgTxlLg9UqtEpZSu5E0wiQJhGWSQNjssW7vv3f3zfvo4ntZlWRUQBjhoURnjJdhNqTzyc0YsK08fTGYPQ28UeGFeldr/dP+gr4YkSN8JsIjdPhrPQjdFKHzmywXk7dywFb4zL9aEwt+8SC+mkFBaLXxc0pnobxcvrGiQue+lHgyH2qWJEkCYVESCJs2lm//u9fe+PLxU4s+uXwuq5iMIggRgudP24R88VLtmVREk2Dg3c0LKPgT82TIRbwZLpF67461ttaoOMaBhUyC8b3fehASDNZ8H8hjgsfcuW0SHAHSYzqqEIw/ES4WnPMf6t2gIJQNQqUOvDd/W9s8gbJhzmgxNg8KekZG1LxH9tSp1K0+SQJhQRIIR3584bnX/1iLwd3HJp67UNGuN6MFwij6RRRyvXUHtAxIU3vaS18uRJ5qbIy6DtWjkQYO0ZUYI2twVCmAUQQhQm/fvkMB0nzDfWqftAq5/9p3LF2yzGPahPiYWmQwZg4KQpE49jz/K0GTXnNStcXRgKICAmJW5U44lB8eioW2v78qJvokY1oSCBMI645nX/s9pbR7fr78/MW+/v7LWSUFCMWVxPejWHw5DMMDoRc3vSfGs3i5N1gMWs022kweXeI+AC/UQ8k3laXT8A4WzKeFRvAg6sw40EUP+tgdsCCFxrwKgapGXa9DPcYITqkHQkQHs9hoSdHtgvPPL4P8wjyXnwsek8uTVTP/mLilIbC7D9qhnvKHo2bIF4M1pxl08/ATxx66S0RsnsSqCFlVliRJAmEWJYFwJLtJ/JEWu4dOzDh1dltlERj9UnmNkA0t+t4al1jVU8PbSCxAahzG8BbKrZUMNk9lWdSSzkpFH2Dp9nn9Usq5z0s0QsyIHeqlHxQ61EfMoJGp6oHQffk7Iwhr+xwxUWLYoI+JptpRxWCZ2g71Imbz2+6XxKqVq4TFlk/rW1aIDunz7ah811mSJAmEWZQxBUJ5CEva/5LvTTbCih3/uKT9LyTnVUEFXNrxxTV7/u31zqt7z2zMxoJ4jbY98aS3pCR0FsLQF3fYQrsCIaGbejAx0GUNizey86lcmESJoRHSBQ3/8acPGS1lRzSiwcgToGICA02XNVIqoSCakshVzjmYcbK70GLptXlMiq4U2xKOmsp21VOIWWUZIZ1p8HSGxrwFsf5XPebMWWql5h9TKQB/Uj0fnjmLZlnLp7VrX1RVzsa6UGv7wlHAZkaWlOl75DI0W9w9f1q5ABxNEJ2pSyKTbJhHm44sSZIEws/KWALh8zv+vqP7hsMnHn7n9Ko3T85Xq0xmQgWCYv5211u30gIvfvLBlf6x8Vub2qHil9e9mBShjL+lrYx/UaOinTt3yRk31ZAUSm9/apDi0bTSBQuelYQuhBJRNJeXeEdrdILTGjHSWoYO7GyGuF5+lUNyKnSrcLJUBBn9Li8c9SyO4iUK+qRkJ+l8PIVOFuPjz3qPiVvqvKxZs5aCOH/+M56Us5AWKFeSVo3NtXfxuYhQGys6hmV4wGl9Titdvux5s9Ea7Z6ujWhn9zxX7MjPXWoezk4fZkmSJBB+VsYKCL8gAvPtU4s//OiwVIRPrnyEOmfOHej9xQbNjMxPQWwx/5a0/7n7HnznwXdOrzx7vrM6OYKNC9faSFnJvJRDO8Bhg1lEKJAIAyEg7X3tw2H4LEVO+rfBNTu53l18Xnu0JBHQyY2c6bk8JsWRCB8NRVDLZdCN9SUKWTJb3D1xuVZeO4+dyZIkSSCsleqDcHH7n20+/H9UrqyOvP/hljfee2zr0at+tv+/V+/6V4WtmwQ/K1m580vr9v2HcJj9PdPf//DVivsCkyRJkiSBsFzGBgg3HPifU2e3Xr7y8SDaQP+lM+cOdve1tXddv3rXvwhdWbj1DzkReRa58eiUxpB0UFe51jCJ2Vb8mr37d42zjgM4PurgpriUOggqOIj+AU5uoq3YSQdHf1AVxU1xdHQQRKmu/qDaSrUiojQ5TGlyvUZD7SXxLiHV1FybxCbGxlwvNY8fcHEp5IlnfLzP68XDccNx3Pbm++u+jTtiVBr/EXNxtda79msBkJgQ7moIx9rPxFzo9ia7Nru9xbWNmaW1+vzyZ63Oocbsiye+fzB2ssQWm5Irf3s/H78vdoGOtp6M+MWqZHxnTIHG3RHxYwqA3IRw90IY85xTF97Y6bWx3fif69jJGYuLEcWzP70WXYyn3n725PQTtckDw8398dviGTq375upx+rtg43ZF87MvhTTnj8svD23+GGsQcZ9Ed3N5QIAIfxPQvjlxP1xOL3ot6ubl6ORcU386vpkPLHvJoZ6BQBCWLUQDp176N84nLcVw8WtXpx2iNe/3tj2AiCEVQzhcPOR2JxSAFAlQribI8J9nZWhAoAqEUIhBEhNCIUQIDUhFEKA1IRQCAFSE0IhBEhNCIUQIDUhFEKA1IRQCAFSE0IhBEhNCIUQIDUhFEKA1IRQCAFSE8JSIazFDRJCCDBIhLCES0aEAANHCEtYWqvXJg8IIcAgEcISur3F0zPPCyHAIBHCcn5cOnJ8/F4hBBgYQlhO79ra9M9vHj51sxACDAYhLO23jdnv5l45fOoWIQQYAEK4E1c2ztfbB4+M7SkZwoc7KycKAKpECHdodX1qtPXUBydvem/kBiNCgP8vIdyhP7Z6cZpirP309keEw839cRKxAKBKhPAfuXxlYuL8q5+euXs7Ifx27uX17nwBQJUIYR80518/Wr8tpkmvl8D3R2481rjLAiFABQlhH2z0LrU6h46P33O9EH48tmd64a34WAFAxQhhf3Q3ly/88kV95rljjTv/nsCPRm+tNR9td979/erFotgqAKgYIeynhZWvR6Ye/+T07TEXGhU8Wt/71dkHWp13YiyoggDVJIQApCaEAKQmhACkJoQApCaEAKQmhACkJoQApCaEAKQmhACkJoQApCaEAKQmhACkJoQApCaEAKQmhACkJoQApCaEAKQmhACkJoQApCaEAKQmhACkJoQApCaEAKQmhACkJoQApCaEAKQmhACkJoQApCaEAKQmhACkJoQApCaEAKQmhACkJoQApCaEAKQmhACkJoQApCaEAKQmhACkJoQApCaEAKQmhACkJoQApCaEAKQmhACkJoQApCaEAKQmhACkJoQApCaEAKQmhACkJoQApCaEAKQmhACkJoQAf7ZXBwIAAAAAgvytB7kkYk2EAKyJEIA1EQKwJkIA1kQIwJoIAVgTIQBrAVw4JOFrX1+hAAAAAElFTkSuQmCC',
                width: 200,
            absolutePosition: {x: 50, y: 0}
          },
          { text: '  ', style: [ 'header', 'anotherStyle' ] },
          { text: diaDeHoyFormatoPDF, style: 'anotherStyle' },
          { text: 'Informes convocatoria', style: 'titulo' },   
          { text: 'Inspector: '+inspector, style: 'header' },
          { text: '  ', style: [ 'header', 'anotherStyle' ] },
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ '*', '*', '*', '*', '*', '*' ],
              
              body: contenidoArmadoDelPDF
            }
          }
        ],

      styles: {
         header: {
           fontSize: 19,
         },
         anotherStyle: {
           italics: true,
           alignment: 'right'
         },
         titulo: {
           fontSize: 24,
           bold: true,
           alignment: 'center'
         }
      }
    }


    return docDefinition ;

  }

  abrirYdescargarPDF(contenidoArmadoParaElPDF){
    let pdfObj = pdfMake.createPdf(contenidoArmadoParaElPDF);

    if (this.plt.is('cordova')) {
        pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'convocatorias.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'convocatorias.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      pdfObj.download("convocatorias.pdf");
    }
  }



  /************************************************ */






  // Conversiones para que se vea con un formato mejor
  stringAsDate(dateStr) {
    let reemplazar=dateStr.replace(/-/g,"/");
    return new Date(reemplazar);
  }


  hora(dateStr){
    var a=dateStr.split(" ")
    return a[1];
  }


  validarFechas(){
    if(this.inicio!=null){
       if(this.fin!=null){
            var a = this.inicio.split("-");
            var inicioSinHoras= new Date(parseInt(a[2]) ,parseInt(a[1])-1, parseInt(a[0]));
            console.log("inicio a validar",inicioSinHoras);

            var b = this.fin.split("-");
            var finSinHoras= new Date(parseInt(b[2]) ,parseInt(b[1])-1, parseInt(b[0]));
            console.log("fin a validar",finSinHoras);
            if(finSinHoras<inicioSinHoras){

              this.fechasNoValidas=true;
            }
            else{
              this.fechasNoValidas=false;
            }
       }
    }

  }
  

  
  usuarioQuiereFiltrarPorFecha(){

    let fechasVacias= (this.inicioFiltro ==null || this.finFiltro == null)  || (this.inicioFiltro=="" || this.finFiltro == "") ;

    if(this.filtroActivado && !fechasVacias && !this.fechasNoValidas){
      return true;
    }
    else{
      return false;
    }
}


    formatoHoraPDF(diaYhora){
      var s=diaYhora.split(" ");
      var dia=s[0].split("-");
      var hora=s[1];
      var fecha=dia[1]+"/"+dia[0]+"/"+dia[2]+" "+hora;
      return fecha;
    }



 



 


}
