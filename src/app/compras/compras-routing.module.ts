import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComprasPage } from './compras.page';

import { RelatorioComponent } from './relatorio/relatorio.component';
import { RelatorioItensComponent } from './relatorio-itens/relatorio-itens.component'

const routes: Routes = [

  {
    path: '',
    redirectTo: 'relatorio',
    pathMatch: 'full'
  },
  {
    path: 'relatorio',
    component: RelatorioComponent
  },
  {
    path: 'relatorio-itens',
    component: RelatorioItensComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprasPageRoutingModule { }
