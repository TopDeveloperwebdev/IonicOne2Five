import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DBService } from '../../services/DB.service';
import { NavController, ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
// import { FiltroPedidosComponent } from '../filtro-pedidos/filtro-pedidos.component';
import { FiltroComponent } from '../../pedidos/filtro/filtro.component';
import { ConexaoService } from '../../services/conexao.service';
import { dataService } from '../../services/data.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {
  pedidos = [];

  filtro = {};
  nomecliente = '';
  cliente_id: '';
  db: any;

  constructor(
    public route: ActivatedRoute,
    public dbService: DBService,
    public navCtl: NavController,
    public modalController: ModalController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    public loadCtrl: LoadingController,
    public conexaoService: ConexaoService,
    public dataService: dataService) {

    this.cliente_id = this.route.snapshot.params['cliente_id'];

    this.nomecliente = this.route.snapshot.params['nomecliente'];
    this.db = dbService;
  }

  ngOnInit() {
    this.listaPedidos(this.cliente_id);
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
            this.listaPedidos(this.cliente_id);
          }
        }
      ]
    });
    await alert.present();
  }
  async presentToast(mensaje: any) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }

  async listaPedidos(cliente_id) {
    const self = this;
    self.pedidos = [];
    return this.dbService.table('pedido').toArray().then(res => {
      return res.filter(function (where) {
        return where.cliente_id === Number(self.cliente_id);
      })
    }).then(function (pedidos) {
      self.pedidos = pedidos.map(function (pedido) {
        if (!pedido.hasOwnProperty('enviado')) {
          pedido.enviado = 'S';
        }
        return pedido;
      });

      self.filterItems(self.filtro);

    });

  }
  filterItems(filtro) {
    const self = this;
    const filters = self.pedidos.filter(function (where) {
      console.log('where', where);
      const comando = [];
      let cData = filtro.criterioData;
      let dateRange = true;
      let tipo_pedido = true;
      let situacao = true;
      console.log('this.filto', filtro);
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

    self.pedidos = filters;
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
    let totalPedidos = this.totalPedidos(this.pedidos);
    localStorage.setItem('totalPedidos', JSON.stringify(totalPedidos));
    this.navCtl.navigateForward(['pedidos/cadastro', { 'cliente_id': cliente_id, 'nomecliente': nomecliente }]);
  }
  alterar(p, nomecliente) {
    let totalPedidos = this.totalPedidos(this.pedidos);
    localStorage.setItem('totalPedidos', JSON.stringify(totalPedidos));
    let pedido = JSON.stringify(p);
    this.navCtl.navigateForward(['pedidos/cadastro', { 'pedido': pedido, 'nomecliente': nomecliente }]);
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
        console.log('this.filtro', this.filter);
        this.listaPedidos(this.cliente_id);
      });

    return await modal.present();
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
        this.listaPedidos(this.cliente_id);
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
          this.listaPedidos(this.cliente_id);
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

 
}

