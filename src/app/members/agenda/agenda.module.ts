import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AgendaPage } from './agenda.page';
import { NgCalendarModule  } from 'ionic2-calendar';
// The modal's module of the previous chapter
import {EventModalPageModule} from '../event-modal/event-modal.module';




const routes: Routes = [
  {
    path: '',
    component: AgendaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgCalendarModule
  ],
  declarations: [AgendaPage],
  exports: [AgendaPage],
  
})
export class AgendaPageModule {}
