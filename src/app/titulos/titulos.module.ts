import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule, } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TitulosPageRoutingModule } from './titulos-routing.module';

import { FiltroComponent } from './filtro/filtro.component';
import { ListaComponent } from './lista/lista.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TitulosPageRoutingModule
  ],
  declarations: [ ListaComponent ,FiltroComponent]
})
export class TitulosPageModule { }
