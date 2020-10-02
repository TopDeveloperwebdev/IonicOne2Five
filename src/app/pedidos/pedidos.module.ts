import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidosPageRoutingModule } from './pedidos-routing.module';

import { PedidosPage } from './pedidos.page';
import { CadastroComponent } from './cadastro/cadastro.component';
import { DetalhesProdutoComponent } from './detalhes-produto/detalhes-produto.component'
import { AddProdutoComponent } from './add-produto/add-produto.component';
import { ConfirmaProdutoComponent} from './confirma-produto/confirma-produto.component'
import { FiltroComponent } from './filtro/filtro.component';
import {NgxMaskIonicModule} from 'ngx-mask-ionic';
import { CurrencyMaskModule } from "ng2-currency-mask";
import {MessageComponent} from './message/message.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidosPageRoutingModule,
    NgxMaskIonicModule,
    CurrencyMaskModule
  ],
  declarations: [PedidosPage,MessageComponent, CadastroComponent, DetalhesProdutoComponent,AddProdutoComponent,ConfirmaProdutoComponent ,FiltroComponent],

})
export class PedidosPageModule { }
