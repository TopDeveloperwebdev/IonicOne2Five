import { Component, OnInit } from '@angular/core';
import { dataService } from '../../services/data.service';
import { ActionSheetController, NavController, ModalController, LoadingController } from '@ionic/angular';
import { FiltroComponent } from '../filtro/filtro.component';
import { DBService } from '../../services/DB.service';
@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {

  clientes = [];
  clientesDataservice: any;
  usuario: any;
  page_limit = 50;
  increaseItems = 50;


  constructor(private loadCtrl: LoadingController, private dataService: dataService, public actionSheetController: ActionSheetController, private navCtl: NavController, public modalController: ModalController, private dbService: DBService) {

  }
  async ngOnInit() {
    const loading = await this.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();
    let usertemp = await this.dbService.table('usuario').toArray();
    this.usuario = usertemp[0];
    this.dbService.table('clientes').toArray().then(res => {
      this.clientesDataservice = res[0];
      this.pushClients(this.page_limit);
      loading.dismiss();
    })
  }
  pushClients(page_limit) {
    this.clientes = this.clientesDataservice.slice(0, page_limit);
  }
  loadMore($event) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.clientesDataservice.length > this.page_limit + this.increaseItems) {
          this.page_limit = this.page_limit + this.increaseItems;
          this.pushClients(this.page_limit);
        }

        $event.target.complete();
        resolve();
      }, 500);
    })

  };

  async opcoes(cliente_id, razaosocial) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Pedidos',
        role: 'destructive',
        icon: 'list',
        handler: () => {
          this.navCtl.navigateForward('clientes/pedidos');
        }
      }, {
        text: 'Cadastro',
        icon: 'create',
        handler: () => {
          this.navCtl.navigateForward('clientes/cadastro');
        }
      }, {
        text: 'Títulos',
        icon: 'albums',
        handler: () => {
          this.navCtl.navigateForward('clientes/titulos');
        }
      }, {
        text: 'Motivos de Não Venda',
        icon: 'close-circle',
        handler: () => {
          console.log('Favorite clicked');
        }
      }]

    });
    await actionSheet.present();
  }
  cadastro() {
    this.navCtl.navigateForward('clientes/cadastro');
  }
  async filter() {
    const modal = await this.modalController.create({
      component: FiltroComponent,
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }


}