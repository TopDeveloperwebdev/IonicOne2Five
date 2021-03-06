import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdutosPageRoutingModule } from './produtos-routing.module';

import { ProdutosPage } from './produtos.page';
import { ListaComponent } from './lista/lista.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { FiltroComponent } from './filtro/filtro.component';
import { ComissoesComponent } from './comissoes/comissoes.component';
import { FotosComponent } from './fotos/fotos.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdutosPageRoutingModule
  ],
  declarations: [ProdutosPage, ListaComponent, DetalhesComponent, FiltroComponent, ComissoesComponent ,FotosComponent]
})
export class ProdutosPageModule { }
