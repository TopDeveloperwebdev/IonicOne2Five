import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientesPage } from './clientes.page';
import { ListaComponent } from './lista/lista.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { MotiCadastroComponent } from './motivonaovenda/cadastro/cadastro.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full'
  },
  {
    path: 'lista',
    component: ListaComponent
  },
  {
    path: 'pedidos',
    component: PedidosComponent
  }, {
    path: 'cadastro',
    component: CadastroComponent
  }

  , {
    path: 'alterar',
    component: MotiCadastroComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesPageRoutingModule { }
