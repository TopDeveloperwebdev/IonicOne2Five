import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, ModalController, NavController, Platform } from '@ionic/angular'
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DBService } from '../../services/DB.service';
import { AddProdutoComponent } from '../add-produto/add-produto.component'
import { Geolocation } from '@ionic-native/geolocation/ngx'

import { ConfirmaProdutoComponent } from '../confirma-produto/confirma-produto.component';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent implements OnInit, OnDestroy {
  nomecliente: any;
  urgente: any;
  pedido: any = {};
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
  limit: any;
  pedidos: any;
  user: any;
  tabela_id: any;
  filtro = {};
  notPedidos : any;
  backButtonSubscription: Subscription;

  private unsubscribeAll$ = new Subject<any>();
  constructor(
    public route: ActivatedRoute,
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public dbService: DBService,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public geolocation: Geolocation,
    private datePipe: DatePipe,
    public platform: Platform

  ) {
    this.db = dbService;
  }

  async ngOnInit() {


    const self = this;
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      document.addEventListener('backbutton', this.backButtonBehavior, false);
    });

    this.platform.backButton
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(async () => {
        await this.voltar();
      });

    self.itens = [];
    this.loadingStart = await self.loadCtrl.create({
      message: 'Aguarde!'
    });
    this.loadingStart.present();

    self.cliente_id = self.route.snapshot.params['cliente_id'];

    self.user = await this.dbService.table('usuario').toArray();
    this.pedido_valor_minimo = self.user[0].valor_minimo_pedido;
    ;
    this.valor_minimo_obrigatorio = true;
    this.valor_pedido_minimo = 0;
    this.mostrar_pedido_minimo = false;
    this.condicoes = await this.dbService.table('condicoe').toArray();
    this.formas = await this.dbService.table('forma').toArray();
    this.tabelas = await this.dbService.table('tabela').toArray();
    if (this.cliente_id) {
      this.cliente = await this.db.clientes.where('cli_id').equals(Number(this.cliente_id)).first();
    }
    console.log('asdf', this.cliente);
    this.tabela_id = this.tabelas[0].tabela_id;
    this.tipos = [
      { codigo: "P", nome: "Pedido" },
      { codigo: "B", nome: "Bônus" },
      { codigo: "T", nome: "Troca" },
      { codigo: "O", nome: "Orçamento" }
    ];
    self.nomecliente = self.route.snapshot.params['nomecliente'];
    self.cliente_id = self.route.snapshot.params['cliente_id'];
    let is = self.route.snapshot.params['is'];
    this.itens = [];
    self.listaPedidos(self.cliente_id);
    if (is == 'create') {
      this.createPedidos();
    } else {
      this.editPedios();
    }


  }

  ngOnDestroy() {
    console.log('cadastroComponent:onDestroy');
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
    this.backButtonSubscription.unsubscribe();

    document.removeEventListener('backbutton', this.backButtonBehavior);
  }
  MinimunOrder() {
    return Number(this.pedido_valor_minimo).toFixed(2);
  }
  backButtonBehavior(event) {
    event.preventDefault();
    event.stopPropagation();

  }

  editPedios() {
    let self = this;
    let pedido = JSON.parse(self.route.snapshot.params['pedido']);
    console.log('pedido', pedido);
    let dataHora;
    if (pedido.data_entrega.split(" ")) {
      dataHora = pedido.data_entrega.split(" ");
    }

    pedido.data_entrega = dataHora[0];
    this.db.clientes
      .where('cli_id')
      .equals(Number(self.cliente_id))
      .first()
      .then(res => {
        if (pedido.tipo_pedido != 'O' && res.credito_bloqueado === "S") {
          self.pedidosConfirm();
          self.loadingStart.dismiss();
        }
      })
    pedido.urgente = pedido.urgente == "S" ? true : false;
    let pedido_id;

    if (isNaN(pedido.pedido_id)) {
      pedido_id = pedido.cod_pedido_mob;
    } else {
      pedido_id = pedido.pedido_id;
    }
    self.pedido = pedido;

    self.getItensPedido(pedido_id, null).then(res => {
      self.itens = res;
      self.pedido.codigo_tabela_preco = self.tabelas[0].tabela_id;

      this.loadingStart.dismiss();
    }, error => {
      this.loadingStart.dismiss(error);
      self.presentConfirm();
    });

  }
  async createPedidos() {
    let self = this;
    self.itens = [];
    let pedido;
    pedido = {};
    pedido.cod_pedido_mob = null;
    pedido.pedido_id = null;
    pedido.urgente = false;
    pedido.total_itens = 0;
    pedido.total_pedido = 0.0;
    pedido.enviado = "N";
    pedido.cliente_id = Number(self.cliente_id);
    self.pedido = pedido;
    this.db.clientes
      .where('cli_id')
      .equals(Number(self.cliente_id))
      .first()
      .then(res => {
        self.pedido.codigo_forma_pagto = res.formapagto_id;
        self.pedido.codigo_condicao_pagto = res.condicaopagto_id;
        self.pedido.tipo_pedido = "P";
        self.pedido.data_entrega = self.gerarDataDeEntregaPadrao();
        self.pedido.codigo_tabela_preco = self.tabelas[0].tabela_id;
        self.cliente = res;

     

        if (res.formapagto_id == null) {
          self.pedido.codigo_condicao_pagto = self.condicoes[0].condicao_id;
        }

        if (res.credito_bloqueado === "S") {
          self.pedidosConfirm();
          self.loadingStart.dismiss();

        } else {
          if (res.cli_totaltitulosvencidos > 0) {
            self.alertConfirm("Atenção!", "Cliente com Titulos Vencidos no total de R$ " + res.cli_totaltitulosvencidos);
          }
          self.loadingStart.dismiss();
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

    let foramteDate = this.datePipe.transform(proximaData, "yyyy-MM-dd");
    return foramteDate;
  }
  async listaPedidos(cliente_id) {
    let self = this;
    this.pedidos = [];
    self.notPedidos = [];

    this.dbService.table('pedido').where('cliente_id').equals(Number(cliente_id)).toArray().then(res => {
      console.log('epedidoall' , res);
      res.map(function (pedido) {
        let p = pedido;
      
        if(pedido.enviado == "N"){
     
          self.notPedidos.push(pedido);
        
        }
        if (!pedido.hasOwnProperty("enviado")) {
          p.enviado = "S";
        }
      
        self.pedidos.push(p);

      });
      console.log('notPedidos' , self.notPedidos);
    })



  }
  async getItensPedido(pedido_id, tabela_id) {
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
                    if (tabela_id) {
                      i = this.recalcularItem(i, prod, tabela_id);
                    }
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
  async _getItensPedido(tabela_id) {
    const self = this;
    var itensArray = [];
    return new Promise((resolve, reject) => {

      if (self.itens.length) {
        self.itens.map((item, index) => {
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
              if (tabela_id) {
                i = this.recalcularItem(i, prod, tabela_id);
              }
              itensArray.push(i);
              if (index == self.itens.length - 1) {
                return resolve(itensArray);
              }
            })
        });
      } else {
        return resolve(itensArray);
      }
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
            if (this.cliente_id) {
              this.navCtrl.navigateForward(['clientes/pedidos', { 'cliente_id': this.cliente_id, 'nomecliente': this.nomecliente }]);
            }
            else {
              this.navCtrl.navigateForward('pedidos');
            }
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
      message: 'Problema ao Carregar a Consulta Tente novamente.',
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
        'tabela_id': this.tabela_id,
        'pedido': this.pedido,
        'itens': this.itens,
        'usuario': usuario,
        'filtro': this.filtro
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        // Here's your selected user!
        if (data['data']) {
          this.itens = data['data'].itens;
          this.pedido = data['data'].pedido;
          this.filtro = data['data'].filtro;
        }

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
          handler: () => {
            if (this.cliente_id) {
              this.navCtrl.navigateForward(['clientes/pedidos', { 'cliente_id': this.cliente_id, 'nomecliente': this.nomecliente }]);
            }
            else {
              this.navCtrl.navigateForward('pedidos');
            }
          }
        },

        {
          text: "Não",
          cssClass: 'No button-assertive',
          handler: () => {
            // return false;
          }
        }
      ]
    });
    await alert.present();
  }
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
    var posOptions = {
      timeout: 5000,
      maximumAge: 3000,
      enableHighAccuracy: true
    };

    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'button button-assertive',
          handler: () => {
            this.geolocation.getCurrentPosition(posOptions).then(position => {
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

  totalPedidos(filtro) {
    console.log('asdff' , filtro);
    if (typeof filtro != "undefined" && filtro.length > 0) {
      var total = 0.0;
      for (var i in filtro) {
        total += parseFloat(filtro[i].total_pedido);
      }

      
      return total.toFixed(2);
    } else {
      return 0;
    }
  }
  async setPedidoMinimo() {

    const loading = await this.loadCtrl.create({
      message: 'Aguarde'
    });
    loading.present();
    var condicao = Number(this.pedido.codigo_condicao_pagto);

    this.db.condicoe
      .where("condicao_id")
      .equals(condicao)
      .first()
      .then(res => {

        if (res.valor_minimo_pedido > 0) {
          this.pedido_valor_minimo = res.valor_minimo_pedido;
          this.valor_minimo_obrigatorio = res.valor_minimo_obrigatorio;
          this.valor_pedido_minimo = res.valor_minimo_pedido;
        } else {
          this.pedido_valor_minimo = this.user.valor_minimo_pedido;
          this.valor_minimo_obrigatorio = true;
        }

        loading.dismiss();
      });
  }
  //////// get result 

  async gravarPedido(pedido, itens, lat, lng) {

    var pedidoObj = pedido;
    var id = this.guid();
    if (pedido.cod_pedido_mob == null) {
      pedidoObj.cod_pedido_mob = id;
      pedidoObj.pedido_id = id;
    }


    pedidoObj.data_entrega = this.datePipe.transform(pedido.data_entrega, "yyyy-MM-dd");
    let temp = await this.db.table('usuario').toArray();
    pedidoObj.vendedor_id = temp[0].vendedor_id;
    pedidoObj.urgente = pedido.urgente == true ? "S" : "N";
    pedidoObj.data_gravacao = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    pedidoObj.hora_gravacao = this.datePipe.transform(new Date(), "HH:mm:ss");

    pedidoObj.enviado = "N";
    pedidoObj.latitude_gravacao = lat;
    pedidoObj.longitude_gravacao = lng;
    pedidoObj.total_itens = itens.length;

    let self = this;
    const loading = await this.loadCtrl.create({
      message: 'Salvando Pedido. Aguarde'
    });
    loading.present();

    this.db.itempedido
      .where("pedido_id")
      .equals(pedidoObj.pedido_id)
      .delete()
      .then(() => {
        let itensCount = 0;
        console.log('itens2', itens);
        itens.map((value) => {
          var itempedido;
          let id = self.guid();
          itempedido = {
            item_id: id,
            pedido_id: pedidoObj.pedido_id,
            codigo_produto: value.codigo_produto,
            descricao: value.descricao,
            quantidade: value.quantidade,
            preco_unitario_bruto: value.preco_unitario_bruto,
            desc_unitario_percentual: value.desc_unitario_percentual,
            preco_unitario_comdesconto: value.preco_unitario_comdesconto,
            valor_total_item: value.valor_total_item,
            enviado: "N",
            http_img_1: value.http_img_1,
            http_img_2: value.http_img_2,
            http_img_3: value.http_img_3,
            http_img_4: value.http_img_4,
            http_img_5: value.http_img_5,
            http_img_6: value.http_img_6,
          };

          self.db.itempedido.add(itempedido).then(res => {
            itensCount++;
            if (itens.length == itensCount) {
              this.db.pedido.put(pedidoObj)
            }
          })

        });

      }).then(() => {
        loading.dismiss();

        if (self.cliente_id) {
          console.log('client_id', self.cliente_id);
          self.navCtrl.navigateForward(['clientes/pedidos', { 'cliente_id': self.cliente_id, 'nomecliente': self.nomecliente }]);
        }
        else {
          self.navCtrl.navigateForward('pedidos');
        }

      }).catch(function (error) {
        console.log('erro', error);
        loading.dismiss();
      });

  }
  alterarProdutoPedido(produto, index) {
    let produtoEscolhido = produto;
    this.confirmarProduto(produtoEscolhido, index);
  }

  async confirmarProduto(produtoEscolhido, index) {
    const modal = await this.modalCtrl.create({
      component: ConfirmaProdutoComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'produtoEscolhido': produtoEscolhido,

      }
    });
    modal.onDidDismiss()
      .then((data) => {
        let producto = data['data'];
        this.itens[index] = producto;
        this.atualizarTotalPedido();
      });

    return await modal.present();
  }
  apagarPedido(index) {
    var listaItens = this.itens;
    this.itens = listaItens.filter(function (element, i) {
      if (i != index) return element;
    });
  }
  apagarProdutoPedido(produto) {
    console.log('right')
    this.apagarItemPedido(produto);
  }
  apagarItemPedido(produto) {
    this.apagarPedido(produto);
    this.atualizarTotalPedido();
  }
  salvar(pedido, itens) {
    console.log('itens', itens);
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
    let currentCredits = this.calculateLimit(this.cliente, this.pedidos);

    var posOptions = {
      timeout: 5000,
      maximumAge: 3000,
      enableHighAccuracy: true
    };
    
    if (pedido.tipo_pedido != 'O' && limite != false && currentCredits - valor_pedido < 0) {
      this.alertConfirm("Atenção!", "Cliente sem limite de crédito.");
    }
    else if (valor_pedido < valor_min_pedido.toFixed(2)) {
      this.alertConfirm("Atenção!", "O valor minimo para fechar o pedido deve ser de R$" + valor_min_pedido.toFixed(2));
    } else if (valor_pedido < valor_min_pedido.toFixed(2) && this.valor_minimo_obrigatorio == false) {
      this.alertConfirm2('Atenção!', 'O pedido vai ser gravado com valor inferior ao minimo de R$' +  valor_min_pedido.toFixed(2), pedido, itens);
    } else {
     
      this.geolocation.getCurrentPosition(posOptions).then(position => {       
        this.gravarPedido(
          pedido,
          itens,
          position.coords.latitude,
          position.coords.longitude
        );
      }).catch(function (error) {

        this.gravarPedido(pedido, itens, null, null);
      })
    }
  }
  limiteDisponivel(cliente) {
    return (Number(cliente.cli_limitecredito) - (Number(cliente.cli_totaltitulosvencidos) + Number(cliente.cli_totaltitulosavencer))).toFixed(2);
  }

  calculateLimit(cliente, pedidos) {
    const limitcliente = this.limiteDisponivel(cliente);
    const limitpedidos = this.totalPedidos(this.notPedidos);    
    if (limitcliente) {     
      console.log('limitcliente' , limitcliente , limitpedidos ,Number(limitcliente) - Number(limitpedidos));
      return Number(limitcliente) - Number(limitpedidos);
    }

  }
  guid() {
    return (
      this.s4() +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      this.s4() +
      this.s4()
    );
  }
  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  /// update price 
  async mudarTabelaPreco() {

    const loading = await this.loadCtrl.create({
      message: 'Atualizando tabela de preços do pedido. Aguarde!'
    });
    loading.present();
    this.tabela_id = this.pedido.codigo_tabela_preco;
    this._getItensPedido(this.pedido.codigo_tabela_preco).then(
      res => {
        console.log("chamou getItensPedido ao trocar tabela", res);

        this.itens = res;

        this.atualizarTotalPedido();
        loading.dismiss();
      }
    );

  }
  atualizarTotalPedido() {
    this.pedido.total_pedido = 0;
    this.itens.map(i => {
      var item = parseFloat(i.valor_total_item);
      var total_pedido = parseFloat(this.pedido.total_pedido);
      var soma_itens = total_pedido + item;

      this.pedido.total_pedido = soma_itens.toFixed(2);
    });
  }
  recalcularItem(item, produto, tabela_id) {
    var strTabelas = produto.tabelas;
    var tabelas = strTabelas.split("|");

    tabelas.forEach(tabela => {
      var campos = tabela.split("-");

      if (campos[0] == tabela_id) {
        console.log("pegar os valores desta tabela:", campos);

        var valor = campos[1];
        valor = valor.replace(",", ".");
        item = this.recalculaPrecoComDesconto(item, parseFloat(valor));
      }
    });

    return item;
  }

  recalculaPrecoComDesconto(produto, valor) {
    var preco_unitario_bruto = parseFloat(produto.preco_unitario_bruto);
    var preco_unitario_comdesconto = parseFloat(
      produto.preco_unitario_comdesconto
    );
    var quantidade = parseFloat(produto.quantidade);

    var diferenca = preco_unitario_bruto - preco_unitario_comdesconto;
    var porcentagem = diferenca / preco_unitario_bruto;

    console.log(
      "desconto para ser reaplicado: ",
      preco_unitario_bruto,
      preco_unitario_comdesconto,
      diferenca,
      porcentagem,
      valor
    );

    produto.preco_unitario_bruto = valor;

    if (diferenca != 0) {
      produto.preco_unitario_comdesconto = valor - valor * porcentagem;
    } else {
      produto.preco_unitario_comdesconto = valor;
    }

    var valor_total = produto.preco_unitario_comdesconto * quantidade;
    produto.valor_total_item = valor_total.toFixed(2);

    return produto;
  }


}
