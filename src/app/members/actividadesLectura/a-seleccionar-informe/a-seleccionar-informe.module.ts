import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ASeleccionarInformePage } from './a-seleccionar-informe.page';

const routes: Routes = [
  {
    path: '',
    component: ASeleccionarInformePage,
    children:[
      { path: 'listarEventos', loadChildren: '../listar-eventos/listar-eventos.module#ListarEventosPageModule' },
      { path: 'listarGestionTerritorial', loadChildren: '../listar-gestion-territorial/listar-gestion-territorial.module#ListarGestionTerritorialPageModule' },
      { path: 'listarVisitaSede', loadChildren: '../listar-visita-sede/listar-visita-sede.module#ListarVisitaSedePageModule' },
  
    
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ASeleccionarInformePage]
})
export class ASeleccionarInformePageModule {}
