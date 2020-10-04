import { Component, OnInit } from '@angular/core';
import { FiltroComponent } from './filtro/filtro.component'
import { DBService } from '../services/DB.service';
import { ActionSheetController, NavController, ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { ConexaoService } from '../services/conexao.service';
import { dataService } from '../services/data.service';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})

export class PedidosPage implements OnInit {
  pedidos: any;

  filtro = {};
  nomecliente = '';
  cliente_id: '';
  pedidostodos: any;
  executaFiltro: any;
  db: any;
  pedidostodosLength = 0;
  constructor(
    public dbService: DBService,
    public navCtl: NavController,
    public modalController: ModalController,
    public loadCtrl: LoadingController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    public conexaoService: ConexaoService,
    public actionSheetController: ActionSheetController,
    public dataService: dataService) {
    this.db = dbService;
    this.pedidos = [];
  }

  async ngOnInit() {
    this.filtro = { situacao: 'N' };
    this.pushPedidos(this.filtro);


  }
  async pushPedidos(filtro) {
    const loading = await this.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();
    let self = this;
    self.executaFiltro = true;
    self.pedidos = await this.listaPedidosTodos(filtro);
    loading.dismiss();
  }
  async listaPedidosTodos(filtro) {
    var prodArray = [];
    let self = this;
    let tempPedidos = [];
    return new Promise((resolve, reject) => {
      self.db.pedido
        .orderBy("data_entrega")
        .desc()
        .toArray()
        .then(function (pedidos) {

          pedidos.map((pedido, index) => {
            var p;
            p = pedido;
            if (!p.hasOwnProperty("enviado")) {
              p.enviado = "S";
            }

            self.db.clientes
              .where("cli_id")
              .equals(p.cliente_id)
              .first()
              .then(function (res) {              
                if (res) {
                  if (res.hasOwnProperty("cli_razaosocial")) {
                    p.nomecliente = res.cli_razaosocial;
                  } else {
                    p.nomecliente = res.cli_fantasia;
                  }
                }


                var entrega = p.data_entrega.split(" ");
                p.data_entrega = entrega[0];
                tempPedidos.push(p);
                if (pedidos.length - 1 == index) {

                  let filters = self.filterItems(filtro, tempPedidos);

                  return resolve(filters);
                }
              });
          });
        })
    });

  }
  filterItems(filtro, pedidos) {
    const self = this;
    const filters = pedidos.filter((where, index) => {
      const comando = [];
      let cData = filtro.criterioData;
      let dateRange = true;
      let tipo_pedido = true;
      let situacao = true;
      if (filtro.hasOwnProperty('inicio')) {
        let dataInicio = Date.parse(filtro.inicio);
        let dataFim = Date.parse(filtro.fim);
        if (cData === 'C') {
          dateRange = (Date.parse(where.data_gravacao + ' 00:00:00') >=
            dataInicio && Date.parse(where.data_gravacao + ' 00:00:00') <= dataFim)
        } else {
          dateRange = (Date.parse(where.data_entrega.substring(0, 10) + ' 00:00:00') >=
            dataInicio && Date.parse(where.data_entrega.substring(0, 10) + ' 00:00:00') <= dataFim)
        }
      }
      if (filtro.hasOwnProperty('tipo_pedido')) {
        tipo_pedido = (where.tipo_pedido == filtro.tipo_pedido);
      }

      if (filtro.hasOwnProperty('situacao')) {

        situacao = (where.enviado == filtro.situacao);
      }

      return (dateRange && tipo_pedido && situacao)
    });
    return filters;
  }

  tipoPedidoFilter(input) {
    const tipos = [
      { codigo: 'P', nome: 'Pedido' },
      { codigo: 'B', nome: 'Bônus' },
      { codigo: 'T', nome: 'Troca' },
      { codigo: 'O', nome: 'Orçamento' }
    ];
    var tipo = tipos.filter((tipo) => {

      return tipo.codigo == input;

    });
    return tipo.length > 0 ? tipo[0].nome : input;
  }


  totalPedidos(filtro) {
    if (typeof filtro != 'undefined' && filtro.length > 0) {
      var total = 0.0;
      for (var i in filtro) {
        total += parseFloat(filtro[i].total_pedido);
      }

      return total.toFixed(2);
    } else {
      return 0;
    }
  }
  cadastro(cliente_id, nomecliente) {
    this.navCtl.navigateForward(['pedidos/cadastro', { 'cliente_id': cliente_id, 'nomecliente': nomecliente }]);
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
          this.pushPedidos(this.filtro);
        }

      });

    return await modal.present();
  }
  alterar(p) {
    let pedido = JSON.stringify(p);
    this.navCtl.navigateForward(['pedidos/cadastro', { 'is': 'edit', 'pedido': pedido, 'nomecliente': p.nomecliente }]);
  }
  async apagarPedido(pedido) {
    let self = this;
    if (isNaN(pedido.pedido_id)) {
      const loading = await this.loadCtrl.create({
        message: 'Apagando pedido. Aguarde!'
      });
      loading.present();
      this.apagarPedidoAPP(pedido.pedido_id).then(res => {
        loading.dismiss();
        this.pushPedidos(this.filtro);
      });
    } else {
      if (this.conexaoService.conexaoOnline()) {

        const loading = await this.loadCtrl.create({
          message: 'Apagando pedido. Aguarde!'
        });
        loading.present();

        this.dataService.getApagarPedido(pedido.pedido_id);

        self.apagarPedidoAPP(pedido.pedido_id).then(res => {
          loading.dismiss();
          this.pushPedidos({});
        })
      } else {
        this.confirmAlert('Atenção!', 'Não é possivel remover este pedido sem estar conectado a internet.')
      }
    }
  }
  async apagarPedidoAPP(pedido_id) {
    return Promise.all(
      [
        this.db.pedido.where("pedido_id").equals(pedido_id).delete(),
        this.db.itempedido.where("pedido_id").equals(pedido_id).delete()
      ]);
  }
  async duplicarPedido(pedido) {
    let self = this;
    const loading = await this.loadCtrl.create({
      message: 'Duplicando pedido. Aguarde!'
    });
    loading.present();

    var novo_pedido_id = this.guid();
    var novoPedido;
    var id_pedido;

    if (isNaN(pedido.pedido_id)) {
      id_pedido = pedido.cod_pedido_mob;
    } else {
      id_pedido = pedido.pedido_id;
    }
    novoPedido = pedido;
    novoPedido.pedido_id = novo_pedido_id;
    novoPedido.cod_pedido_mob = novo_pedido_id;
    novoPedido.enviado = "N";
    this.db.pedido.add(novoPedido);

    this.db.itempedido
      .where("pedido_id")
      .equals(id_pedido)
      .toArray()
      .then(res => {
        res.map(item => {
          var novoItem;
          novoItem = item;
          novoItem.item_id = this.guid();
          novoItem.pedido_id = novo_pedido_id;
          novoItem.enviado = "N";
          self.db.table('itempedido').add(novoItem);
        });     
        loading.dismiss();
        self.confirmAlert('Mensagem', 'Pedido duplicado com sucesso');
      });
  }
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }
  async confirmAlert(header, message) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'button button-assertive',
          handler: () => {
            this.pushPedidos(this.filtro);
          }
        }
      ]
    });
    await alert.present();
  }
  async opcoes(pedido) {

    const actionSheet = await this.actionSheetController.create({
      header: 'Opções',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Alterar Pedido',
        role: 'create',
        icon: 'create-outline',
        handler: () => {
          this.alterar(pedido);
        }
      }, {
        text: 'Excluir Pedido',
        icon: 'trash-outline',
        handler: () => {
          this.apagarPedido(pedido)
        }
      }, {
        text: 'Duplicar Pedido',
        icon: 'copy-outline',
        handler: () => {
          this.duplicarPedido(pedido)
        }
      },
        // {
        //   text: 'Enviar Email',
        //   icon: 'close-circle',
        //   handler: () => {
        //     let pedidodata = JSON.stringify(pedido);
        //     this.sendEmail(pedido, cliente_id);
        //     // this.navCtl.navigateForward(['pedidos/message', { 'pedido': pedidodata, 'cliente_id': cliente_id }]);
        //   }
        // }
      ]

    });
    await actionSheet.present();
  }
}
