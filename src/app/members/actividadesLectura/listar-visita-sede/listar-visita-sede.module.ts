import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListarVisitaSedePage } from './listar-visita-sede.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

const routes: Routes = [
  {
    path: '',
    component: ListarVisitaSedePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicSelectableModule,
    Ionic4DatepickerModule,
    NgxMaterialTimepickerModule
  ],
  declarations: [ListarVisitaSedePage]
})
export class ListarVisitaSedePageModule {}
