import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientesPageRoutingModule } from './clientes-routing.module';

import { ClientesPage } from './clientes.page';
import { ListaComponent } from './lista/lista.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { FiltroComponent } from './filtro/filtro.component';
import { MotiCadastroComponent } from './motivonaovenda/cadastro/cadastro.component';
import { FiltroPedidosComponent } from './filtro-pedidos/filtro-pedidos.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ClientesPageRoutingModule
  ],
  declarations: [
    ClientesPage, 
    ListaComponent, 
    PedidosComponent, 
    CadastroComponent, 

    FiltroComponent, 
    MotiCadastroComponent, 
    FiltroPedidosComponent]
})
export class ClientesPageModule { }
