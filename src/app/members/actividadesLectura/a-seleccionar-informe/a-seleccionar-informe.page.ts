import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';


@Component({
  selector: 'app-a-seleccionar-informe',
  templateUrl: './a-seleccionar-informe.page.html',
  styleUrls: ['./a-seleccionar-informe.page.scss'],
})
export class ASeleccionarInformePage implements OnInit {
  url;
  selectedPath='';
  opciones=["Convocatoria","Trabajo administrativo","Visita Escuela","Licencia"];

  constructor(private router:Router) { 
    this.router.events.subscribe((event:RouterEvent)=>{
      this.selectedPath=event.url;
    })
  }


  ngOnInit() {
  }

  ionViewDidEnter(){
    console.log("ionViewDidEnter");
  }



  onChange(newValue) {
    let irUrl=""
    console.log("url listar visita escuela");
    console.log(this.url);
    switch(this.url){
      case("Convocatoria"):{
          this.router.navigateByUrl("/members/menu/actividadesLectura/seleccionarInforme/listarConvocatoria");
          break; 
      }
      case("Licencia"):{
          this.router.navigateByUrl("/members/menu/actividadesLectura/seleccionarInforme/listarLicencia");
          break; 
      }
      case("Trabajo administrativo"):{
         this.router.navigateByUrl("/members/menu/actividadesLectura/seleccionarInforme/listarTrabajoAdmin");
         break; 
      }
      case("Visita Escuela"):{
         this.router.navigateByUrl("/members/menu/actividadesLectura/seleccionarInforme/listarVisita");
         break; 
      }
      default:
         this.router.navigateByUrl("/members/menu/actividadesLectura/seleccionarInforme/listarConvocatoria");
         break; 
    };
  }

}
