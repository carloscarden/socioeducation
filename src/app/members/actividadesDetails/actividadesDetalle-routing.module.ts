import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'eventoDetalles/:id', loadChildren: './eventos-details/eventos-details.module#EventosDetailsPageModule' },
  { path: 'visitaDetalles/:id', loadChildren: './visita-details/visita-details.module#VisitaDetailsPageModule' },
  { path: 'gestionDetalles/:id', loadChildren: './gestion-territorial-details/gestion-territorial-details.module#GestionTerritorialDetailsPageModule' },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActividadesDetalleRoutingModule { }
