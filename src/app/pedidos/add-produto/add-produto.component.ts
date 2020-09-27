import { Component, OnInit, Input, ComponentFactoryResolver } from '@angular/core';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { DBService } from '../../services/DB.service';
import { ConfirmaProdutoComponent } from '../confirma-produto/confirma-produto.component';

import { FiltroComponent } from '../../produtos/filtro/filtro.component';
import { ComissoesComponent } from '../../produtos/comissoes/comissoes.component';
import { FotosComponent } from '../../produtos/fotos/fotos.component';
@Component({
  selector: 'app-add-produto',
  templateUrl: './add-produto.component.html',
  styleUrls: ['./add-produto.component.scss'],
})
export class AddProdutoComponent implements OnInit {
  db: any;
  listaProdutos = [];
  listaProdutosDataservice: any;
  tabelas: any;
  page_limit = 50;
  increaseItems = 50;
  produtoEscolhido: any;
  @Input() pedido: any;
  @Input() itens: any;
  @Input() usuario: any;
  @Input() tabela_id: any;
  @Input() filtro: any;
  constructor(
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public dbService: DBService,
    public modalCtrl: ModalController) {
    this.db = dbService;
  }

  ngOnInit() {
    console.log('filtro', this.filtro);
    this.produtoInit(this.filtro);
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
  async ErrorConfirm() {

    const alert = await this.alertCtrl.create({
      header: 'Atenção!',
      message: 'Nenhum Produto Located as Filter Used',
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
  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const bandA = a.descricaoproduto.toUpperCase();
    const bandB = b.descricaoproduto.toUpperCase();

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }


  async produtoInit(filtro) {
    let self = this;
    const loading = await this.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();


    this.ListaProdutos(filtro).then(res => {
      let produtos;
      produtos = res;
      console.log('res' ,res['length']);
    if (res['length']) {
        produtos.sort(this.compare);
        this.listaProdutosDataservice = produtos.map((produto, index) => {
          var p;
          p = produto;
          p.precotabela = "";
          self.db.produto_tabela.where('[produto_id+tabela_id]')
            .equals([p.produto_id, self.tabela_id.toString()])
            .first()
            .then((res) => {
              if (res && res.precotabela) {
                p.precotabela = self.toNumber(res.precotabela);
              }
              if (index == produtos.length - 1) {
                this.pushClients(this.page_limit);
                loading.dismiss();
              }
              return p;
            });
          return p;

        });
      
      }
      else {
        this.listaProdutosDataservice = [];
        this.pushClients(this.page_limit);
        loading.dismiss();
        this.ErrorConfirm();
      }    
    },
      err => {
        console.log('eror', err, this.filtro);
        loading.dismiss();
        this.presentConfirm();
      })
  }

  toNumber(string) {
    var number = string.replace(/([.])/g, '');
    return number.replace(',', '.');
  }
  pushClients(page_limit) {
    this.listaProdutos = this.listaProdutosDataservice.slice(0, page_limit);
  }
  async ListaProdutos(filtro) {
    var DB_Produto = await this.db.produto;

    if (
      filtro.hasOwnProperty('descricaoproduto') &&
      filtro.hasOwnProperty('inf_marca') &&
      filtro.hasOwnProperty('inf_produto') &&
      filtro.hasOwnProperty('produtoempromocao')
    ) {
      if (
        filtro.hasOwnProperty('tipopesquisa') &&
        filtro.tipopesquisa == 2
      ) {
        DB_Produto = this.db.produto
          .where('descricaoproduto')
          .startsWithIgnoreCase(filtro.descricaoproduto)
          .and(function (where) {
            return (
              where.inf_marca == filtro.inf_marca &&
              where.inf_produto == filtro.inf_produto &&
              where.produtoempromocao == 'S'
            );
          });
      } else {
        DB_Produto = this.db.produto
          .where('descricaoproduto')
          .startsWithAnyOfIgnoreCase([filtro.descricaoproduto])
          .and(function (where) {
            return (
              where.inf_marca == filtro.inf_marca &&
              where.inf_produto == filtro.inf_produto &&
              where.produtoempromocao == 'S'
            );
          });
      }
    } else if (
      filtro.hasOwnProperty('descricaoproduto') &&
      filtro.hasOwnProperty('inf_marca') &&
      filtro.hasOwnProperty('inf_produto')
    ) {
      if (
        filtro.hasOwnProperty('tipopesquisa') &&
        filtro.tipopesquisa == 2
      ) {
        DB_Produto = this.db.produto
          .where('descricaoproduto')
          .startsWithIgnoreCase(filtro.descricaoproduto)
          .and(function (where) {
            return (
              where.inf_marca == filtro.inf_marca &&
              where.inf_produto == filtro.inf_produto
            );
          });
      } else {
        DB_Produto = this.db.produto
          .where('descricaoproduto')
          .startsWithAnyOfIgnoreCase([filtro.descricaoproduto])
          .and(function (where) {
            return (
              where.inf_marca == filtro.inf_marca &&
              where.inf_produto == filtro.inf_produto
            );
          });
      }
    } else if (
      filtro.hasOwnProperty('descricaoproduto') &&
      filtro.hasOwnProperty('inf_marca') &&
      filtro.hasOwnProperty('produtoempromocao')
    ) {
      if (
        filtro.hasOwnProperty('tipopesquisa') &&
        filtro.tipopesquisa == 2
      ) {
        DB_Produto = this.db.produto
          .where('descricaoproduto')
          .startsWithIgnoreCase(filtro.descricaoproduto)
          .and(function (where) {
            return (
              where.inf_marca == filtro.inf_marca &&
              where.produtoempromocao == 'S'
            );
          });
      } else {
        DB_Produto = this.db.produto
          .where('descricaoproduto')
          .startsWithAnyOfIgnoreCase([filtro.descricaoproduto])
          .and(function (where) {
            return (
              where.inf_marca == filtro.inf_marca &&
              where.produtoempromocao == 'S'
            );
          });
      }
    } else if (
      filtro.hasOwnProperty('descricaoproduto') &&
      filtro.hasOwnProperty('inf_produto') &&
      filtro.hasOwnProperty('produtoempromocao')
    ) {
      if (
        filtro.hasOwnProperty('tipopesquisa') &&
        filtro.tipopesquisa == 2
      ) {
        DB_Produto = this.db.produto
          .where('descricaoproduto')
          .startsWithIgnoreCase(filtro.descricaoproduto)
          .and(function (where) {
            return (
              where.inf_produto == filtro.inf_produto &&
              where.produtoempromocao == 'S'
            );
          });
      } else {
        DB_Produto = this.db.produto
          .where('descricaoproduto')
          .startsWithAnyOfIgnoreCase([filtro.descricaoproduto])
          .and(function (where) {
            return (
              where.inf_produto == filtro.inf_produto &&
              where.produtoempromocao == 'S'
            );
          });
      }
    } else if (
      filtro.hasOwnProperty('inf_marca') &&
      filtro.hasOwnProperty('inf_produto') &&
      filtro.hasOwnProperty('produtoempromocao')
    ) {
      DB_Produto = this.db.produto
        .where('[inf_marca+inf_produto+produtoempromocao]')
        .equals([
          filtro.inf_marca,
          filtro.inf_produto,
          filtro.produtoempromocao
        ]);
    } else if (
      filtro.hasOwnProperty('inf_marca') &&
      filtro.hasOwnProperty('inf_produto')
    ) {
      DB_Produto = this.db.produto
        .where('[inf_marca+inf_produto]')
        .equals([filtro.inf_marca, filtro.inf_produto]);
    } else if (
      filtro.hasOwnProperty('inf_marca') &&
      filtro.hasOwnProperty('produtoempromocao')
    ) {
      DB_Produto = this.db.produto
        .where('[inf_marca+produtoempromocao]')
        .equals([filtro.inf_marca, filtro.produtoempromocao]);
    } else if (
      filtro.hasOwnProperty('inf_produto') &&
      filtro.hasOwnProperty('produtoempromocao')
    ) {
      DB_Produto = this.db.produto
        .where('[inf_produto+produtoempromocao]')
        .equals([filtro.inf_produto, filtro.produtoempromocao]);
    } else if (
      filtro.hasOwnProperty('descricaoproduto') &&
      filtro.hasOwnProperty('produtoempromocao')
    ) {
      if (
        filtro.hasOwnProperty('tipopesquisa') &&
        filtro.tipopesquisa == 2
      ) {
        DB_Produto = this.db.produto
          .where('descricaoproduto')
          .startsWithIgnoreCase(filtro.descricaoproduto)
          .and(function (where) {
            return where.produtoempromocao == 'S';
          });
      } else {
        DB_Produto = this.db.produto
          .where('descricaoproduto')
          .startsWithAnyOfIgnoreCase([filtro.descricaoproduto])
          .and(function (where) {
            return where.produtoempromocao == 'S';
          });
      }
    } else if (
      filtro.hasOwnProperty('descricaoproduto') &&
      filtro.hasOwnProperty('inf_marca')
    ) {
      if (
        filtro.hasOwnProperty('tipopesquisa') &&
        filtro.tipopesquisa == 2
      ) {
        DB_Produto = this.db.produto
          .where('descricaoproduto')
          .startsWithIgnoreCase(filtro.descricaoproduto)
          .and(function (where) {
            return where.inf_marca == filtro.inf_marca;
          });
      } else {
        DB_Produto = this.db.produto
          .where('descricaoproduto')
          .startsWithAnyOfIgnoreCase([filtro.descricaoproduto])
          .and(function (where) {
            return where.inf_marca == filtro.inf_marca;
          });
      }
    } else if (
      filtro.hasOwnProperty('descricaoproduto') &&
      filtro.hasOwnProperty('inf_produto')
    ) {
      if (
        filtro.hasOwnProperty('tipopesquisa') &&
        filtro.tipopesquisa == 2
      ) {
        DB_Produto = this.db.produto
          .where('descricaoproduto')
          .startsWithIgnoreCase(filtro.descricaoproduto)
          .and(function (where) {
            return where.inf_produto == filtro.inf_produto;
          });
      } else {
        DB_Produto = this.db.produto
          .where('descricaoproduto')
          .startsWithAnyOfIgnoreCase([filtro.descricaoproduto])
          .and(function (where) {
            return where.inf_produto == filtro.inf_produto;
          });
      }
    } else if (filtro.hasOwnProperty('descricaoproduto')) {
      if (
        filtro.hasOwnProperty('tipopesquisa') &&
        filtro.tipopesquisa == 2
      ) {
        DB_Produto = this.db.produto
          .where('descricaoproduto')
          .startsWithIgnoreCase(filtro.descricaoproduto);
      } else {
        var str = new RegExp(filtro.descricaoproduto);
        DB_Produto = this.db.produto.filter(function (produto) {
          return str.test(produto.descricaoproduto);
        });
      }
    } else if (filtro.hasOwnProperty('inf_marca')) {
      DB_Produto = this.db.produto.where('inf_marca').equals(filtro.inf_marca);

    } else if (filtro.hasOwnProperty('inf_produto')) {
      DB_Produto = this.db.produto
        .where('inf_produto')
        .equals(filtro.inf_produto);
    } else if (filtro.hasOwnProperty('produtoempromocao')) {
      DB_Produto = this.db.produto
        .where('produtoempromocao')
        .equals(filtro.produtoempromocao);
    }
    console.log('profduc', DB_Produto.toArray());
    return new Promise((resolve, reject) => {
      return resolve(DB_Produto.toArray());
    })

  }
  loadMore($event) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.listaProdutosDataservice.length > this.page_limit + this.increaseItems) {
          this.page_limit = this.page_limit + this.increaseItems;
          this.pushClients(this.page_limit);
        }

        $event.target.complete();
        resolve();
      }, 500);
    })

  }

  dismiss() {
    this.modalCtrl.dismiss({ itens: this.itens, pedido: this.pedido, filtro: this.filtro });
    // this.itens, this.pedido
  }
  addProdutoPedido(produto) {
    let self = this;
    this.verificaProdutoLista(produto.produto_id).then(p => {

      if (typeof p === "object") {
        this.WarningAlert(p);
      } else {
        console.log('produto-------', produto);
        self.produtoEscolhido = {
          codigo_produto: produto.produto_id,
          dados_adicionais: produto.dados_adicionais,
          descricao: produto.descricaoproduto,
          preco_unitario_bruto: produto.precotabela,
          desc_unitario_percentual: 0,
          quantidade: 1,
          acrescimo: 0.0,
          preco_unitario_comdesconto: produto.precotabela,
          valor_total_item: produto.precotabela,
          desc_maximopercentual: produto.desc_maximopercentual,
          promocao: produto.produtoempromocao,
          embalagem: produto.embalagem,
          produtoembalagem:
            (produto.produtoembalagem && produto.produtoembalagem) > 1 ?
              produto.produtoembalagem : 1,
          estoque_offline: produto.estoque_offline,
          custo: self.usuario.vendedor_visualiza_custo == "N" ? 0.0 : produto.custo,
          preco_promocao: produto.preco_promocao,
          preco_unitario_promocao: produto.preco_promocao /
            (produto.produtoembalagem ? produto.produtoembalagem : 1),
          data_inicio_promocao: produto.data_inicio_promocao,
          data_fim_promocao: produto.data_fim_promocao,
          marca: produto.inf_marca,
          tipo: produto.inf_produto,
          obs: produto.obs,
          http_img_1: produto.http_img_1,
          http_img_2: produto.http_img_2,
          http_img_3: produto.http_img_3,
          http_img_4: produto.http_img_4,
          http_img_5: produto.http_img_5,
          http_img_6: produto.http_img_6,
        };
        //  $scope.confirmarProduto.show();

        self.confirmarProduto(self.produtoEscolhido);
      }
    });
  }
  async WarningAlert(p) {
    const alert = await this.alertCtrl.create({
      header: 'Atenção!',
      message: 'Este produto já existe na lista.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'button button-assertive',
          handler: () => {
            console.log(p);
            this.produtoEscolhido = p;
            this.confirmarProduto(this.produtoEscolhido);
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmarProduto(produtoEscolhido) {
    let self = this;
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

        if (producto) {
          self.confirmaProdutoPedido(producto);
          setTimeout(() => {
            self.modalCtrl.dismiss({ itens: self.itens, pedido: self.pedido, filtro: self.filtro });
          }, 0.00001);


        }
      });

    return await modal.present();
  }

  async comissoes(produto_id) {
    const modal = await this.modalCtrl.create({
      component: ComissoesComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'produto_id': produto_id,

      }
    });
    modal.onDidDismiss()
      .then((data) => {
        let producto = data['data'];
        if (producto) {
          this.confirmaProdutoPedido(producto);
        }
      });

    return await modal.present();
  }
  async filtorProduto(produtoEscolhido) {

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
        if (producto) {
          this.confirmaProdutoPedido(producto);
        }
      });

    return await modal.present();
  }
  async Fotos(produto) {

    const modal = await this.modalCtrl.create({
      component: FotosComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'produto': produto,

      }
    });
    modal.onDidDismiss()
      .then((data) => {


      });

    return await modal.present();
  }
  verificaProdutoLista(produto_id) {
    var retorno = false;
    this.itens.map(function (value) {
      if (value.codigo_produto == produto_id) {
        retorno = value;
      }
    });
    return new Promise((resolve, reject) => {
      return resolve(retorno);
    })
  }
  //get new add produto

  confirmaProdutoPedido = function (produto) {
    console.log('produto', produto);
    this.apagarItemPedido(produto);
    this.itens.push(produto);
    this.atualizarTotalPedido();

  };
  apagarItemPedido(produto) {
    this.apagarProdutoPedido(produto);
    this.atualizarTotalPedido();
  }
  apagarProdutoPedido(produto) {
    var listaItens = this.itens;
    this.itens = listaItens.filter(function (element) {
      console.log('element', element, produto);
      if (element != produto) return element;
    });
  }
  atualizarTotalPedido() {
    this.pedido.total_pedido = 0;
    this.itens.map(i => {
      var item = parseFloat(i.valor_total_item);
      var total_pedido = parseFloat(this.pedido.total_pedido);
      var soma_itens = total_pedido + item;
      this.pedido.total_pedido = soma_itens.toFixed(2);
    })

  }
  async filter() {
    const modal = await this.modalCtrl.create({
      component: FiltroComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'filtro': this.filtro,
        'tabela_id': this.tabela_id

      }
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data['data']) {
          this.filtro = data['data'].filtro;
          this.tabela_id = data['data'].tabela_id;
          this.produtoInit(this.filtro);

        }

      });

    return await modal.present();
  }
}