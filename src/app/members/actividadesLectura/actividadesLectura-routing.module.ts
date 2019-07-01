import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'seleccionarInforme', loadChildren: './a-seleccionar-informe/a-seleccionar-informe.module#ASeleccionarInformePageModule' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActividadesLecturaRoutingModule { }
