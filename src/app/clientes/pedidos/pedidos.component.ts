import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DBService } from '../../services/DB.service';
import { ActionSheetController, NavController, ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { FiltroComponent } from '../../pedidos/filtro/filtro.component';
import { ConexaoService } from '../../services/conexao.service';
import { dataService } from '../../services/data.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {
  pedidos = [];

  filtro = {};
  nomecliente = '';
  cliente: any;
  cliente_id: '';
  db: any;
  itens: any;
  selectedPedido: any;
  condicoes: any;
  formas: any;
  usuario: any;
  constructor(
    public route: ActivatedRoute,
    public dbService: DBService,
    public navCtl: NavController,
    public modalController: ModalController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    public loadCtrl: LoadingController,
    public conexaoService: ConexaoService,
    public actionSheetController: ActionSheetController,
    public emailComposer: EmailComposer,
    public dataService: dataService) {

    this.cliente = {};
    this.selectedPedido = {};
    this.db = dbService;
    this.usuario = {};
    this.condicoes = {};
    this.formas = {};
  }

  async ionViewDidEnter() {

    this.cliente_id = this.route.snapshot.params['cliente_id'];
    this.nomecliente = this.route.snapshot.params['nomecliente'];

    this.listaPedidos(this.cliente_id);
    this.cliente = await this.db.clientes.where('cli_id').equals(Number(this.cliente_id)).first();
    let usertemp = await this.dbService.table('usuario').toArray();
    this.usuario = usertemp[0];
    this.condicoes = await this.db.condicoe.where('vendedor_id').equals(Number(this.usuario.vendedor_id)).first();
    this.formas = await this.db.forma.where('vendedor_id').equals(Number(this.usuario.vendedor_id)).first();
    console.log('asdfasdf', this.condicoes, this.formas);
  }
  ngOnInit() {

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
          console.log('this.filtro', this.filter);
          this.listaPedidos(this.cliente_id);
        }

      });

    return await modal.present();
  }
  cadastro(cliente_id, nomecliente) {
    let totalPedidos = this.totalPedidos(this.pedidos);
    localStorage.setItem('totalPedidos', JSON.stringify(totalPedidos));
    this.navCtl.navigateForward(['pedidos/cadastro', { 'is': 'create', 'cliente_id': cliente_id, 'nomecliente': nomecliente }]);
  }
  alterar(p, cliente_id, nomecliente) {
    let totalPedidos = this.totalPedidos(this.pedidos);
    localStorage.setItem('totalPedidos', JSON.stringify(totalPedidos));
    let pedido = JSON.stringify(p);
    this.navCtl.navigateForward(['pedidos/cadastro', { 'is': 'edit', 'pedido': pedido, 'cliente_id': cliente_id, 'nomecliente': nomecliente }]);
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
  async pedidosConfirm() {
    console.log('Alert Shown Method Accessed!');
    const alert = await this.alertCtrl.create({
      header: 'Atenção!',
      message: 'Cliente com crédito bloqueado! Não será possivel cadastrar pedidos.',
      buttons: [
        {
          text: 'Voltar',
          role: 'cancel',
          cssClass: 'button button-assertive',
          handler: () => {
            if (this.cliente_id) {
              //   this.navCtrl.navigateForward(['clientes/pedidos', { 'cliente_id': this.cliente_id, 'nomecliente': this.nomecliente }]);
            }
            else {
              //    this.navCtrl.navigateForward('pedidos');
            }
          }
        }
      ]
    });
    await alert.present();
  }
  async apagarPedidoAPP(pedido_id) {
    return Promise.all(
      [
        this.db.pedido.where("pedido_id").equals(pedido_id).delete(),
        this.db.itempedido.where("pedido_id").equals(pedido_id).delete()
      ]);
  }
  async duplicarPedido(pedido) {
    const loading = await this.loadCtrl.create({
      message: 'Duplicando pedido. Aguarde!'
    });
    loading.present();
    let self = this;
    var valor_pedido;
    valor_pedido = parseFloat(pedido.total_pedido);
    var limite;


    if (this.cliente.credito_bloqueado === "S") {
      self.pedidosConfirm();
      loading.dismiss();
    }
    else {
      limite = this.cliente && this.cliente.trava_limite_credito ? this.limiteDisponivel(this.cliente) : false;
      var valor_outros_pedidos;
      valor_outros_pedidos = JSON.parse(localStorage.getItem('totalPedidos'));

      if (limite != false && limite - valor_pedido - valor_outros_pedidos < 0) {
        this.alertConfirm("Atenção!", "Cliente sem limite de crédito.");
        loading.dismiss();
      } else {
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
            this.listaPedidos(this.cliente_id);
          });

      }

    }


  }
  limiteDisponivel(cliente) {
    return (Number(cliente.cli_limitecredito) - (Number(cliente.cli_totaltitulosvencidos) + Number(cliente.cli_totaltitulosavencer))).toFixed(2);
  }
  async alertConfirm(header, message) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'button button-assertive',
        }
      ]
    });
    await alert.present();
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
  async opcoes(pedido, cliente_id, nomecliente) {

    const actionSheet = await this.actionSheetController.create({
      header: 'Opções',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Alterar Pedido',
        role: 'create',
        icon: 'create-outline',
        handler: () => {
          this.alterar(pedido, cliente_id, nomecliente);
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
      {
        text: 'Enviar Email',
        icon: 'close-circle',
        handler: () => {
          let pedidodata = JSON.stringify(pedido);
          this.selectedPedido = pedido;

          this.sendEmail(pedido, cliente_id);
          // this.navCtl.navigateForward(['pedidos/message', { 'pedido': pedidodata, 'cliente_id': cliente_id }]);
        }
      }
      ]

    });
    await actionSheet.present();
  }

  sendEmail(pedido, cliente_id) {
    this.getItems(pedido);

  }
  getItems(pedido) {
    let pedido_id;
    if (isNaN(pedido.pedido_id)) {
      pedido_id = pedido.cod_pedido_mob;
    } else {
      pedido_id = pedido.pedido_id;
    }
    this.getItensPedido(pedido_id).then(res => {
      this.itens = res;
      setTimeout(() => {
        console.log('this', document.getElementById('printable-area'))
        this.generatePDF();
      }, 10);

    })
  }

  async getItensPedido(pedido_id) {
    const self = this;
    var itensArray = [];
    var produtosArray = [];
    return new Promise((resolve, reject) => {
      self.db.itempedido
        .where('pedido_id')
        .equals(pedido_id)
        .toArray()
        .then(
          itens => {

            if (itens.length) {
              itens.map((item, index) => {
                var i;
                i = item;
                return self.dbService.table('produto')
                  .where('produto_id')
                  .equals(i.codigo_produto)
                  .first().then(res => {
                    let prod;
                    prod = res;
                    i.descricao = prod && prod.descricaoproduto ?
                      prod.descricaoproduto :
                      "N/I";

                    itensArray.push(i);
                    if (index == itens.length - 1) {
                      return resolve(itensArray);
                    }
                  })
              });
            } else {
              return resolve(itensArray);
            }

          },
          err => {
            return reject(err);
          });
    });

  }
  generatePDF() {




  }
}
