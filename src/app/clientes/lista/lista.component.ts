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

  clientes: any;
  clientesDataservice: any;
  usuario: any;
  page_limit = 50;
  increaseItems = 50;
  pagina = 0;
  filtro: any;
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
    this.filtro = {};
    this.clientes = [];
    this.clientsInit(this.filtro);
  }

  async clientsInit(filtro) {
    const loading = await this.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();
    let usertemp = await this.dbService.table('usuario').toArray();
    this.usuario = usertemp[0];

    this.clientesDataservice = [];
    this.filterItems(filtro, this.pagina, this.page_limit).then(res => {
      this.clientes = res;  
      this.clientes.sort(this.compare);  
      loading.dismiss();
    });
  }

  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const bandA = a.cli_razaosocial.toUpperCase();
    const bandB = b.cli_razaosocial.toUpperCase();

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }
  async filterItems(filtro, pagina, limite) {

    let DB_clients = await this.db.clientes;
     console.log('total clientlength' , await this.db.clientes.orderBy('cli_razaosocial').toArray());
    let cli_razaosocial = true;
    let cli_totaltitulosvencidos = true;
    let categoria_id = true;
    let atividade_id = true;
    let responsavel_id = true;
    let dia_visita = true;


    DB_clients = this.db.clientes
      .filter( (where) => {
        if (filtro.hasOwnProperty('cli_razaosocial')) {

          if (filtro.tipopesquisa == "2") {
            var str = new RegExp('^' + filtro.cli_razaosocial, 'i');
            cli_razaosocial = str.test(where.cli_razaosocial)
          } else {
            var str = new RegExp(filtro.cli_razaosocial);

            cli_razaosocial = str.test(where.cli_razaosocial);

          }
        }

        if (filtro.hasOwnProperty('cli_totaltitulosvencidos')) {
          cli_totaltitulosvencidos = (where.cli_totaltitulosvencidos != filtro.cli_totaltitulosvencidos);
        }

        if (filtro.hasOwnProperty('categoria_id')) {
          categoria_id = (where.categoria_id == filtro.categoria_id);

        }

        if (filtro.hasOwnProperty('atividade_id')) {

          atividade_id = (where.atividade_id == filtro.atividade_id);
        }

        if (filtro.hasOwnProperty('responsavel_id')) {
          responsavel_id = (where.responsavel_id == filtro.responsavel_id);
        }

        if (filtro.hasOwnProperty('dia_visita')) {

          dia_visita = (where.dia_visita == filtro.dia_visita);

        }
        return (cli_razaosocial && cli_totaltitulosvencidos && atividade_id && categoria_id && responsavel_id && dia_visita)
      });

    return new Promise((resolve, reject) => {
      return resolve(DB_clients.offset(pagina * limite)
        .limit(limite).toArray());
    })

  }
  // pushClients(page_limit) {

  //   this.clientes = this.clientesDataservice.slice(0, page_limit);
  // }
  loadMore($event) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.pagina++;

        this.filterItems(this.filtro, this.pagina, this.page_limit).then(res => {
          this.clientes = this.clientes.concat(res);
          this.clientes.sort(this.compare); 
        })
        $event.target.complete();
        resolve();
      }, 500);
    })

  };

  async opcoes(cliente_id, razaosocial) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opções',
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
          this.navCtl.navigateForward(['clientes/cadastro', { 'cliente_id': cliente_id }]);
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
        if (data['data']) {
          this.filtro = data['data']; // Here's your selected user!    
          this.pagina = 0;
          this.clientsInit(this.filtro);
        }

      });

    return await modal.present();
  }

}