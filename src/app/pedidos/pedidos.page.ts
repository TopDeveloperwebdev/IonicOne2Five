import { Component, OnInit } from '@angular/core';
import { FiltroComponent } from './filtro/filtro.component'
import { DBService } from '../services/DB.service';
import { ActionSheetController, NavController, ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { ConexaoService } from '../services/conexao.service';
import { dataService } from '../services/data.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { exportPDF, Group } from '@progress/kendo-drawing';


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
  itens: any;
  selectedPedido: any;
  pedidostodosLength = 0;
  usuario: any;
  condicoes: any;
  formas: any;
  cliente: any;

  constructor(
    public dbService: DBService,
    public navCtl: NavController,
    public modalController: ModalController,
    public loadCtrl: LoadingController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    public conexaoService: ConexaoService,
    public actionSheetController: ActionSheetController,
    public emailComposer: EmailComposer,
    public dataService: dataService) {
    this.db = dbService;
    this.pedidos = [];
    this.cliente = {};
    this.selectedPedido = {};
    this.usuario = {};
    this.condicoes = {};
    this.formas = {};
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
    this.navCtl.navigateForward(['pedidos/cadastro', { 'is': 'edit', 'pedido': pedido, 'cliente_id': p.cliente_id, 'nomecliente': p.nomecliente }]);
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
  // async duplicarPedido(pedido) {
  //   let self = this;
  //   const loading = await this.loadCtrl.create({
  //     message: 'Duplicando pedido. Aguarde!'
  //   });
  //   loading.present();

  //   var novo_pedido_id = this.guid();
  //   var novoPedido;
  //   var id_pedido;

  //   if (isNaN(pedido.pedido_id)) {
  //     id_pedido = pedido.cod_pedido_mob;
  //   } else {
  //     id_pedido = pedido.pedido_id;
  //   }
  //   novoPedido = pedido;
  //   novoPedido.pedido_id = novo_pedido_id;
  //   novoPedido.cod_pedido_mob = novo_pedido_id;
  //   novoPedido.enviado = "N";
  //   this.db.pedido.add(novoPedido);

  //   this.db.itempedido
  //     .where("pedido_id")
  //     .equals(id_pedido)
  //     .toArray()
  //     .then(res => {
  //       res.map(item => {
  //         var novoItem;
  //         novoItem = item;
  //         novoItem.item_id = this.guid();
  //         novoItem.pedido_id = novo_pedido_id;
  //         novoItem.enviado = "N";
  //         self.db.table('itempedido').add(novoItem);
  //       });
  //       loading.dismiss();
  //       self.confirmAlert('Mensagem', 'Pedido duplicado com sucesso');
  //     });
  // }
  async duplicarPedido(pedido) {
    const loading = await this.loadCtrl.create({
      message: 'Duplicando pedido. Aguarde!'
    });
    loading.present();
    let self = this;
    var valor_pedido;
    valor_pedido = parseFloat(pedido.total_pedido);
    var limite;

    let notPedidos = await this.db.pedido.where({ cliente_id: this.cliente.cli_id, enviado: "N" }).toArray();

    let currentCredits = this.calculateLimit(this.cliente, notPedidos);


    if (pedido.tipo_pedido != 'O' && this.cliente.credito_bloqueado === "S") {
      this.confirmAlert("Atenção!", "Cliente com crédito bloqueado! Não será possivel cadastrar pedidos.");
      loading.dismiss();
    }
    else {
      limite = this.cliente && this.cliente.trava_limite_credito ? this.limiteDisponivel(this.cliente) : false;

      var valor_outros_pedidos;
      valor_outros_pedidos = JSON.parse(localStorage.getItem('totalPedidos'));

      if (pedido.tipo_pedido != 'O' && limite != false && currentCredits - valor_pedido < 0) {
        this.confirmAlert("Atenção!", "Cliente sem limite de crédito.");
        loading.dismiss();
      }
      else {
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

    }


  }

  limiteDisponivel(cliente) {
    return (Number(cliente.cli_limitecredito) - (Number(cliente.cli_totaltitulosvencidos) + Number(cliente.cli_totaltitulosavencer))).toFixed(2);
  }

  calculateLimit(cliente, notPedidos) {

    const limitcliente = this.limiteDisponivel(cliente);
    const limitpedidos = this.totalPedidos(notPedidos);

    if (limitcliente) {
      return Number(limitcliente) - Number(limitpedidos);
    }

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
  async opcoes(pedido, pdfComponent: any) {
    // async opcoes(pedido) {

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
          this.db.clientes.where('cli_id').equals(Number(pedido.cliente_id)).first().then(res => {
            this.cliente = res;
            this.duplicarPedido(pedido)
          })

        }
      },
      {
        text: 'Enviar Email',
        icon: 'at',
        handler: () => {
          this.selectedPedido = pedido;
          this.InitValue(pedido.cliente_id);
          this.getItems(pedido, pedido.cliente_id, pdfComponent);

        }
      }
      ]

    });
    await actionSheet.present();
  }
  async InitValue(cliente_id) {
    this.cliente = await this.db.clientes.where('cli_id').equals(Number(cliente_id)).first();
    let usertemp = await this.dbService.table('usuario').toArray();
    this.usuario = usertemp[0];
    this.condicoes = await this.db.condicoe.where('vendedor_id').equals(Number(this.usuario.vendedor_id)).first();
    this.formas = await this.db.forma.where('vendedor_id').equals(Number(this.usuario.vendedor_id)).first();

  }


  getItems(pedido, cliente_id, pdfComponent: any) {
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
        this.export(pdfComponent);
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


  calcQuant() {
    let quantidade = 0, valor_total_item = 0;
    if (this.itens) {
      this.itens.forEach(iten => {
        quantidade += Number(iten.quantidade);
        valor_total_item += Number(iten.valor_total_item);
      });
    }

    return quantidade.toFixed(2);

  }
  calcValor_total_item() {
    let valor_total_item = 0;
    if (this.itens) {
      this.itens.forEach(iten => {
        valor_total_item += Number(iten.valor_total_item);
      });
    }

    return valor_total_item.toFixed(2);

  }
  public export(pdfComponent: any): void {
    pdfComponent.export().then((group: Group) => exportPDF(group)).then((dataUri) => {
      console.log('dataUri', dataUri);
      const base64 = dataUri.replace('data:application/pdf;base64,', '');
      console.log('base64', base64);
      let email = {
        to: this.cliente.cli_email,
        attachments: ["base64:data.pdf//" + base64],
        subject: 'Orçamento de compra',
        body: 'Prezado cliente , em anexo PDF do seu orcamento de compra. Obrigado',
        isHtml: true
      }
      //  email.attachments.push(fileObject);

      // Send a text message using default options
      this.emailComposer.open(email);
      //  console.log(base64, fileObject);


    });
  }

}
