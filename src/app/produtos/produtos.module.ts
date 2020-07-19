import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdutosPageRoutingModule } from './produtos-routing.module';

import { ProdutosPage } from './produtos.page';
import { ListaComponent } from './lista/lista.component'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdutosPageRoutingModule
  ],
  declarations: [ProdutosPage ,ListaComponent]
})
export class ProdutosPageModule {}
