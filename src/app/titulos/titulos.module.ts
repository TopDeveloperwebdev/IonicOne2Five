import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TitulosPageRoutingModule } from './titulos-routing.module';

import { TitulosPage } from './titulos.page';
import { ListaComponent } from './lista/lista.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TitulosPageRoutingModule
  ],
  declarations: [TitulosPage, ListaComponent]
})
export class TitulosPageModule { }
