import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidosPage } from './pedidos.page';
import { CadastroComponent } from './cadastro/cadastro.component';
import { DetalhesProdutoComponent } from './detalhes-produto/detalhes-produto.component';

const routes: Routes = [
  {

    path: '',
    component : PedidosPage
  },
  
  {
    path: 'detail',
    component: DetalhesProdutoComponent
  },
 {
    path: 'cadastro',
    component: CadastroComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosPageRoutingModule { }
