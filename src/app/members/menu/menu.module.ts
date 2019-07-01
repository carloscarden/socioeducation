import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children:[
      { path: 'agenda/:id', loadChildren: '../agenda/agenda.module#AgendaPageModule' },
      { path: 'actividad', loadChildren: '../actividades/actividades-routing.module#ActividadesRoutingModule' },
      { path: 'actividadesLectura', loadChildren: '../actividadesLectura/actividadesLectura-routing.module#ActividadesLecturaRoutingModule' },
      { path: 'actividadesDetalles', loadChildren: '../actividadesDetails/actividadesDetalle-routing.module#ActividadesDetalleRoutingModule' },
      { path: 'calendario', loadChildren: '../calendario/calendario.module#CalendarioPageModule' },
  
    
    ]
  },

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
