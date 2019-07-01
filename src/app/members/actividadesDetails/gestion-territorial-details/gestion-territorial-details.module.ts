import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GestionTerritorialDetailsPage } from './gestion-territorial-details.page';

const routes: Routes = [
  {
    path: '',
    component: GestionTerritorialDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GestionTerritorialDetailsPage]
})
export class GestionTerritorialDetailsPageModule {}
