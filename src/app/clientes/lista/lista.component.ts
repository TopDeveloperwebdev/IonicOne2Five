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
  filtro = {};
  db: any;
  valueEmittedFromChildComponent: object = {};
  constructor(
    private loadCtrl: LoadingController,
    private dataService: dataService,
    public actionSheetController: ActionSheetController,
    private navCtl: NavController,
    public modalController: ModalController,
    private dbService: DBService) {
      this.db = dbService;
  }
  ngOnInit() {
    this.clientsInit();
  }
  async clientsInit() {
    const loading = await this.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();
    let usertemp = await this.dbService.table('usuario').toArray();
    this.usuario = usertemp[0];
    this.clientesDataservice = [];
    if (this.filtro.hasOwnProperty('cli_razaosocial') ||
      this.filtro.hasOwnProperty('cli_totaltitulosvencidos') ||
      this.filtro.hasOwnProperty('categoria_id') ||
      this.filtro.hasOwnProperty('atividade_id') ||
      this.filtro.hasOwnProperty('responsavel_id') ||
      this.filtro.hasOwnProperty('dia_visita')
    ) {

      this.clientesDataservice = this.filterItems(this.filtro).then(res => {
        this.clientesDataservice = res;
        console.log('res1', res);
        this.pushClients(this.page_limit);
        loading.dismiss();
      });
    }
    else {
      this.db.clientes.orderBy('cli_razaosocial').toArray().then(res => {      
        // this.clientesDataservice = res[0].sort((a, b) => {return a.cli_razaosocial < b.cli_razaosocial; });
        this.clientesDataservice = res;
        console.log('res2', res);
        this.pushClients(this.page_limit);
        loading.dismiss();
      });
    }
  }
  async filterItems(filtro) {

    return this.db.clientes.orderBy('cli_razaosocial').toArray().then(res => {
      return res.filter(function (where) {
        var comando = [];

        if (filtro.hasOwnProperty('cli_razaosocial')) {
          if (filtro.tipopesquisa == 2) {
            var str = new RegExp('^' + filtro.cli_razaosocial, 'i');
            comando.push('str.test(where.cli_razaosocial)');
          } else {
            var str = new RegExp(filtro.cli_razaosocial);
            comando.push('str.test(where.cli_razaosocial)');
          }
        }

        if (filtro.hasOwnProperty('cli_totaltitulosvencidos')) {
          comando.push('where.cli_totaltitulosvencidos != filtro.cli_totaltitulosvencidos');
        }

        if (filtro.hasOwnProperty('categoria_id')) {
          comando.push('where.categoria_id == filtro.categoria_id');
        }

        if (filtro.hasOwnProperty('atividade_id')) {
          comando.push('where.atividade_id == filtro.atividade_id');
        }

        if (filtro.hasOwnProperty('responsavel_id')) {
          comando.push('where.responsavel_id == filtro.responsavel_id');
        }

        if (filtro.hasOwnProperty('dia_visita')) {
          comando.push('where.dia_visita == filtro.dia_visita');
        }

        return eval(comando.join(' && '));

      });
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
    console.log('asdfasd', razaosocial);
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Pedidos',
        role: 'destructive',
        icon: 'list',
        handler: () => {
          this.navCtl.navigateForward(['clientes/pedidos', { 'cliente_id': cliente_id, 'nomecliente': razaosocial }]);
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
          this.navCtl.navigateForward(['titulos/lista', { 'cliente_id': cliente_id, 'nomecliente': razaosocial }]);
        }
      }, {
        text: 'Motivos de Não Venda',
        icon: 'close-circle',
        handler: () => {         
          this.navCtl.navigateForward(['clientes/naovendalist', { 'cliente_id': cliente_id, 'nomecliente': razaosocial }]);
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
      componentProps: {
        'filtro': this.filtro,

      }
    });
    modal.onDidDismiss()
      .then((data) => {
        this.filtro = data['data']; // Here's your selected user!        
        this.clientsInit();
      });

    return await modal.present();
  }

}