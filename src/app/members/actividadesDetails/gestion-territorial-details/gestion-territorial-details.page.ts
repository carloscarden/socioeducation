import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../_services/authentication.service';
import { GestionTerritorialService } from '../../../_services/gestion-territorial.service';


import {  ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-gestion-territorial-details',
  templateUrl: './gestion-territorial-details.page.html',
  styleUrls: ['./gestion-territorial-details.page.scss'],
})
export class GestionTerritorialDetailsPage implements OnInit {
  trabajoAdmin;
  idInspector=1;

  constructor(private gestionTerritorialAdminService: GestionTerritorialService,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute) { }

  ngOnInit() {

    let idTrabajoAdmin=this.route.snapshot.paramMap.get('id');
    console.log(idTrabajoAdmin);
    let currentUser = this.authenticationService.currentUserValue;
    this.idInspector= currentUser.id;
    this.gestionTerritorialAdminService.getTrabajo(idTrabajoAdmin,this.idInspector) .subscribe(res  =>{
      console.log(res);
      this.trabajoAdmin=[res];
     }  
    );;
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
    console.log(tipo);
    let tipoLower=tipo.toLowerCase();
    console.log( tipoLower.includes("image"));
    return tipoLower.includes("image");
  }


}
