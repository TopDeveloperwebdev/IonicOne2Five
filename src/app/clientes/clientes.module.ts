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
import { naovendaListaComponent } from './motivonaovenda/lista/lista.component';
import { NgxMaskIonicModule} from 'ngx-mask-ionic';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ClientesPageRoutingModule,
    NgxMaskIonicModule,
    PDFExportModule
  ],
  declarations: [
    ClientesPage, 
    ListaComponent, 
    PedidosComponent, 
    CadastroComponent, 
    FiltroComponent, 
    MotiCadastroComponent, 
    FiltroPedidosComponent,naovendaListaComponent]
})
export class ClientesPageModule { }
