import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComprasPageRoutingModule } from './compras-routing.module';

import { ComprasPage } from './compras.page';
import { RelatorioItensComponent } from './relatorio-itens/relatorio-itens.component';
import { RelatorioComponent } from './relatorio/relatorio.component';
import { ItensComponent } from './itens/itens.component';
import { FiltroComponent } from './filtro/filtro.component';
import { from } from 'rxjs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComprasPageRoutingModule
  ],
  declarations: [ComprasPage, RelatorioItensComponent, RelatorioComponent, ItensComponent, FiltroComponent]
})
export class ComprasPageModule { }
