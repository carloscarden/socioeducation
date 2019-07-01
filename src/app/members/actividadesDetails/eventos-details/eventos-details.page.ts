import { Component, OnInit } from '@angular/core';


import { ConvocatoriaServiceService } from '../../../_services/convocatoria-service.service';
import { AuthenticationService } from '../../../_services/authentication.service';


import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-eventos-details',
  templateUrl: './eventos-details.page.html',
  styleUrls: ['./eventos-details.page.scss'],
})
export class EventosDetailsPage implements OnInit {
  idInspector=1;
  convocatoria;
  

  constructor(
    private convocatoriaService: ConvocatoriaServiceService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute) {
     



     }

  ngOnInit() {
    let idConvocatoria=this.route.snapshot.paramMap.get('id');
    console.log(idConvocatoria);
    let currentUser = this.authenticationService.currentUserValue;
    this.idInspector= currentUser.id;
    this.convocatoriaService.getConvocatoria(idConvocatoria,this.idInspector) .subscribe(res  =>{
      console.log(res);
      this.convocatoria=[res];

     }  
    );;

   
   
  }

  crearArchivo(img){
    let i='data:image/jpeg;base64,'+img;
    return i;
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

  esUnaImagen(tipo){
    let tipoLower=tipo.toLowerCase();
    return tipoLower.includes("image");
  }

}
