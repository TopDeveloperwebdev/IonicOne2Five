import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientesPageRoutingModule } from './clientes-routing.module';

import { ClientesPage } from './clientes.page';
import { ListaComponent } from './lista/lista.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { TitulosComponent } from './titulos/titulos.component';
import { FiltroComponent } from './filtro/filtro.component';
import { MotiCadastroComponent } from './motivonaovenda/cadastro/cadastro.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientesPageRoutingModule
  ],
  declarations: [ClientesPage, ListaComponent, PedidosComponent, CadastroComponent, TitulosComponent, FiltroComponent, MotiCadastroComponent]
})
export class ClientesPageModule { }
