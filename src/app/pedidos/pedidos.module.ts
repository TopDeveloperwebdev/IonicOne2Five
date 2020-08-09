import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidosPageRoutingModule } from './pedidos-routing.module';

import { PedidosPage } from './pedidos.page';
import { CadastroComponent } from './cadastro/cadastro.component';
import { DetalhesProdutoComponent } from './detalhes-produto/detalhes-produto.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidosPageRoutingModule
  ],
  declarations: [PedidosPage, CadastroComponent, DetalhesProdutoComponent]
})
export class PedidosPageModule { }
