import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
      { path: 'cargarEventos', loadChildren: './cargar-eventos/cargar-eventos.module#CargarEventosPageModule' },
      { path: 'cargarGestionTerritorial', loadChildren: './cargar-gestion-territorial/cargar-gestion-territorial.module#CargarGestionTerritorialPageModule' },
      { path: 'cargarVisita', loadChildren: './cargar-visita-sede/cargar-visita-sede.module#CargarVisitaSedePageModule' },
      { path: 'seleccionarActividad', loadChildren: './seleccionar-actividad/seleccionar-actividad.module#SeleccionarActividadPageModule' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActividadesRoutingModule { }
