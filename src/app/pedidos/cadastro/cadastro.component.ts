import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, ModalController, NavController } from '@ionic/angular'
import { DBService } from '../../services/DB.service';
import { AddProdutoComponent } from '../add-produto/add-produto.component'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { Guid } from 'guid-typescript';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent implements OnInit {
  nomecliente: any;
  urgente: any;
  pedido: any = [];
  itens: any;
  cliente: any;
  condicoes: any;
  tipos: any;
  formas: any;
  tabelas: any;
  pedido_valor_minimo: any;
  valor_minimo_obrigatorio: any;
  valor_pedido_minimo: any;
  mostrar_pedido_minimo: any;
  db: any;
  cliente_id: any;
  loadingStart: any;
  pedidos: []
  constructor(
    public route: ActivatedRoute,
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public dbService: DBService,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public geolocation: Geolocation,

  ) {
    this.db = dbService
  }

  async ngOnInit() {

    const self = this;
    this.loadingStart = await self.loadCtrl.create({
      message: 'Aguarde!'
    });
    this.loadingStart.present();
    self.cliente_id = self.route.snapshot.params['cliente_id'];
    let user = await this.dbService.table('usuario').toArray();
    this.pedido_valor_minimo = user[0].valor_minimo_pedido;
    this.valor_minimo_obrigatorio = true;
    this.valor_pedido_minimo = 0;
    this.mostrar_pedido_minimo = false;
    this.condicoes = await this.dbService.table('condicoe').toArray();
    this.formas = await this.dbService.table('forma').toArray();
    this.tabelas = await this.dbService.table('tabela').toArray();
    // this.tabelas = this.tabelas[0];
    this.tipos = [
      { codigo: "P", nome: "Pedido" },
      { codigo: "B", nome: "Bônus" },
      { codigo: "T", nome: "Troca" },
      { codigo: "O", nome: "Orçamento" }
    ];

    if (self.cliente_id) {
      this.createPedidos();
    } else {
      this.editPedios();
    }
  }
  editPedios() {
    let self = this;
    self.nomecliente = self.route.snapshot.params['nomecliente'];
    let pedido = JSON.parse(self.route.snapshot.params['pedido']);

    self.cliente = pedido;

    let dataHora = pedido.data_entrega.split(" ");


    pedido.data_entrega = dataHora[0];
    self.pedido = pedido;

    pedido.urgente = pedido.urgente == "S" ? true : false;
    let pedido_id;

    if (isNaN(pedido.pedido_id)) {
      pedido_id = pedido.cod_pedido_mob;
    } else {
      pedido_id = pedido.pedido_id;
    }

    self.getItensPedido(pedido_id).then(res => {
      this.itens = res;
      console.log('sdf', this.itens);
      this.pedido.codigo_tabela_preco = this.tabelas.tabela_id;
      this.loadingStart.dismiss();
    }, error => {
      this.loadingStart.dismiss();
      self.presentConfirm();
    });

  }
  async createPedidos() {
    let self = this;
    self.itens = [];
    self.nomecliente = self.route.snapshot.params['nomecliente'];
    self.cliente_id = self.route.snapshot.params['cliente_id'];

    this.db.clientes
      .where("cli_id")
      .equals(Number(self.cliente_id))
      .first()
      .then(function (res) {
        self.pedido.codigo_forma_pagto = res.formapagto_id;
        self.pedido.codigo_condicao_pagto = res.condicaopagto_id;
        self.pedido.tipo_pedido = "P";
        self.pedido.data_entrega = self.gerarDataDeEntregaPadrao();

        self.nomecliente = self.nomecliente;
        self.cliente = res;

        self.listaPedidos(self.cliente_id);

        if (res.formapagto_id == null) {
          self.pedido.codigo_condicao_pagto = self.condicoes[0].condicao_id;
        }
        self.loadingStart.dismiss();
        if (res.credito_bloqueado === "S") {
          self.pedidosConfirm();
          self.loadingStart.dismiss();

        } else {
          if (res.cli_totaltitulosvencidos > 0) {
            self.alertConfirm("Atenção!", "Cliente com Titulos Vencidos no total de R$ " + res.cli_totaltitulosvencidos);
            self.loadingStart.dismiss();
          }
        }

      });
  }

  gerarDataDeEntregaPadrao() {
    var hoje = new Date();
    var proximaData = new Date();
    var diasAcrescentar = 1;
    switch (hoje.getDay()) {
      case 5:
        diasAcrescentar = 3;
        break;
      case 6:
        diasAcrescentar = 2;
        break;
    }
    proximaData.setDate(hoje.getDate() + diasAcrescentar);
    return proximaData;
  }
  async listaPedidos(cliente_id) {
    this.dbService.table('pedido').toArray().then(res => {
      return res.filter(function (where) {
        return where.cliente_id === Number(cliente_id);
      })
    }).then(function (items) {
      this.pedidos = items.map(function (pedido) {
        if (!pedido.hasOwnProperty('enviado')) {
          pedido.enviado = 'S';
        }
        return pedido;
      });

    });


  }
  async getItensPedido(pedido_id) {
    const self = this;
    var itensArray = [];
    var produtosArray = [];
    return new Promise((resolve, reject) => {
      self.dbService.table('itempedido').toArray().then(
        res => {
          let itens = res.filter(function (where) {
            return where.pedido_id == pedido_id;
          })
          itens.map(function (item, index) {
            var i;
            i = item;
            return self.dbService.table('produto').toArray().then(res => {
              let prod;
              prod = res.filter(function (where) {
                return where.produto_id == i.codigo_produto;
              })

              i.descricao = prod && prod.descricaoproduto ?
                prod.descricaoproduto :
                "N/I";
              itensArray.push(i);
              if (index == itens.length - 1) {
                return resolve(itensArray);
              }
            })
          });
        },
        err => {
          return reject(err);
        });
    });

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
            this.navCtrl.navigateForward(['pedidos/lista', { 'cliente_id': this.pedido.cliente_id }]);
          }
        }
      ]
    });
    await alert.present();
  }
  async presentConfirm() {
    console.log('Alert Shown Method Accessed!');
    const alert = await this.alertCtrl.create({
      header: 'Atenção!',
      message: 'Problema ao carregar itens do pedido. Tente novamente.',
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
  async addProdutoModal() {
    let usertemp = await this.dbService.table('usuario').toArray();
    let usuario = usertemp[0];
    const modal = await this.modalCtrl.create({
      component: AddProdutoComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'pedido': this.pedido,
        'itens': this.itens,
        'usuario': usuario

      }
    });
    modal.onDidDismiss()
      .then((data) => {
        let producto = data['data']; // Here's your selected user!
        this.itens.push(producto);
      });

    return await modal.present();
  }

  async voltar() {
    const alert = await this.alertCtrl.create({
      header: 'Atenção!',
      message: 'O pedido não foi salvo, deseja sair mesmo assim?',
      buttons: [
        {
          text: 'Sim',
          cssClass: 'Yes button button-assertive',
          handler: (e) => {
            console.log('Confirm Cancel');
            this.navCtrl.back();
          }
        },
        {
          text: "Não",
          cssClass: 'No button-assertive',
        }
      ]
    });
    await alert.present();
  };
  async alert(header, message) {
    const alert = await this.alertCtrl.create({
      header: 'Atenção!',
      message: 'Cliente sem limite de crédito.',
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
  async alertConfirm2(header, message, pedido, itens) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'button button-assertive',
          handler: () => {
            this.geolocation.getCurrentPosition().then(position => {
              this.gravarPedido(
                pedido,
                itens,
                position.coords.latitude,
                position.coords.longitude
              );
            }, err => {
              this.gravarPedido(pedido, itens, null, null);
            })
          }
        }
      ]
    });
    await alert.present();
  }
  //////// get result 

  async gravarPedido(pedido, itens, lat, lng) {
    var pedidoObj = pedido;
    var id = Guid.create();

    if (pedido.cod_pedido_mob == null) {
      pedidoObj.cod_pedido_mob = id;
      pedidoObj.pedido_id = id;
    }

    // pedidoObj.data_entrega = $filter("date")(
    //   pedido.data_entrega,
    //   "yyyy-MM-dd"
    // );

    pedidoObj.vendedor_id = this.db.table('usuario').vendedor_id;
    pedidoObj.urgente = pedido.urgente == true ? "S" : "N";
    //pedidoObj.data_gravacao = $filter("date")(new Date(), "yyyy-MM-dd");
    //pedidoObj.hora_gravacao = $filter("date")(new Date(), "HH:mm:ss");
    pedidoObj.enviado = "N";
    pedidoObj.latitude_gravacao = lat;
    pedidoObj.longitude_gravacao = lng;


    const loading = await this.loadCtrl.create({
      message: 'Salvando Pedido. Aguarde'
    });
    loading.present();
    this.db.transaction("rw", this.db.pedido, this.db.itempedido, function () {
      this.db.pedido.put(pedidoObj);
      this.db.itempedido
        .where("pedido_id")
        .equals(pedidoObj.pedido_id)
        .delete()
        .then(function () {
          itens.map(function (value) {
            var itempedido;
            itempedido.item_id = Guid.create();
            itempedido.pedido_id = isNaN(pedidoObj.pedido_id) ?
              pedidoObj.cod_pedido_mob :
              pedidoObj.pedido_id;
            itempedido.codigo_produto = value.codigo_produto;
            itempedido.descricao = value.descricao;
            itempedido.quantidade = value.quantidade;
            itempedido.preco_unitario_bruto = value.preco_unitario_bruto;
            itempedido.desc_unitario_percentual =
              value.desc_unitario_percentual;
            itempedido.preco_unitario_comdesconto =
              value.preco_unitario_comdesconto;
            itempedido.valor_total_item = value.valor_total_item;
            itempedido.enviado = "N";
            this.db.itempedido.add(itempedido);
          });
        });
    }).then(function () {
      loading.dismiss();
      this.navCtl.navigateForward(['pedidos/lista', { 'cliente_id': pedido.cliente_id, 'nomecliente': '' }]);
    })
      .catch(function (error) {
        loading.dismiss();
      });
  }

  salvar(pedido, itens) {
    const itensCount = itens ? itens.length : 0;

    if (!itensCount || itensCount == 0) {
      return;
    }
    var valor_pedido;
    valor_pedido = parseFloat(pedido.total_pedido);
    var valor_min_pedido;
    valor_min_pedido = parseFloat(this.pedido_valor_minimo);
    var limite;
    limite = this.cliente && this.cliente.trava_limite_credito ? this.limiteDisponivel(this.cliente) : false;
    var valor_outros_pedidos;
    valor_outros_pedidos = JSON.parse(localStorage.getItem('totalPedidos'));

    var posOptions = {
      timeout: 5000,
      maximumAge: 3000,
      enableHighAccuracy: true
    };

    if (limite != false && limite - valor_pedido - valor_outros_pedidos < 0) {
      this.alertConfirm("Atenção!", "Cliente sem limite de crédito.");
    }
    else if (valor_pedido < valor_min_pedido.toFixed(2) && this.valor_minimo_obrigatorio == true) {
      this.alertConfirm("Atenção!", "O valor minimo para fechar o pedido deve ser de R$");

    } else if (valor_pedido < valor_min_pedido.toFixed(2) && this.valor_minimo_obrigatorio == false) {
      this.alertConfirm2('Atenção!', 'O pedido vai ser gravado com valor inferior ao minimo de R$ " + valor_min_pedido.toFixed(2)', pedido, itens);
    } else {
      this.geolocation.getCurrentPosition().then(position => {
        this.gravarPedido(
          pedido,
          itens,
          position.coords.latitude,
          position.coords.longitude
        );
      }, err => {
        this.gravarPedido(pedido, itens, null, null);
      })
    }
  };


  limiteDisponivel(cliente) {
    return (
      cliente.cli_limitecredito -
      cliente.cli_totaltitulosvencidos -
      cliente.cli_totaltitulosavencer
    ).toFixed(2);
  };


}
