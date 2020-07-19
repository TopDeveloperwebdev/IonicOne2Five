import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientesPage } from './clientes.page';
import { ListaComponent } from './lista/lista.component';
const routes: Routes = [
  {
    path: '',
    component: ListaComponent
  },
  {
    path: '/lista',
    component: ListaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesPageRoutingModule {}
