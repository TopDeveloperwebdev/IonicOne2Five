import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { DBService } from '../../services/DB.service';
import { ConfirmaProdutoComponent } from '../confirma-produto/confirma-produto.component';
import { FiltroComponent } from '../filtro/filtro.component'
@Component({
  selector: 'app-add-produto',
  templateUrl: './add-produto.component.html',
  styleUrls: ['./add-produto.component.scss'],
})
export class AddProdutoComponent implements OnInit {
  filtro = {};
  db: any;
  listaProdutos = [];
  listaProdutosDataservice: any;

  page_limit = 50;
  increaseItems = 50;
  produtoEscolhido: any;
  @Input() pedido: any;
  @Input() itens: any;
  @Input() usuario: any;
  constructor(
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public dbService: DBService,
    public modalCtrl: ModalController) {
    this.db = dbService;
  }

  ngOnInit() {
    this.produtoInit();
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
  async produtoInit() {
    let self = this;
    const loading = await this.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();

    this.ListaProdutos(self.filtro).then(res => {
      console.log('res', res);
      this.listaProdutosDataservice = res;
      this.pushClients(this.page_limit);
      loading.dismiss();
    },
      err => {
        loading.dismiss();
        this.presentConfirm();
      })
  }
  pushClients(page_limit) {
    this.listaProdutos = this.listaProdutosDataservice.slice(0, page_limit);
  }
  async ListaProdutos(filtro) {

    //var deferred = $q.defer();

    var tabela = this.pedido.codigo_tabela_preco;
    if (!isNaN(tabela)) {
      var DB_Produto = await this.db.produto.orderBy('descricaoproduto');

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
      return new Promise((resolve, reject) => {
        return resolve(DB_Produto.toArray());
      })

    }
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

  };

  dismiss() {
    console.log('dismass');
    this.modalCtrl.dismiss(this.itens, this.pedido);
  }
  addProdutoPedido(produto) {
    let self = this;
    this.verificaProdutoLista(produto.produto_id).then(function (p) {
      if (typeof p === "object") {
        const alert = this.alertCtrl.create({
          header: 'Atenção!',
          message: 'Este produto já existe na lista.',
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
              cssClass: 'button button-assertive',
              onTap: function () {
                console.log(p);
                self.produtoEscolhido = p;
                self.confirmarProduto(this.produtoEscolhido);
              }
            }
          ]
        });
        alert.present();
      } else {
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
          obs: produto.obs
        };
        //  $scope.confirmarProduto.show();

        self.confirmarProduto(self.produtoEscolhido);
      }
    });
  };

  async confirmarProduto(produtoEscolhido) {
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
    this.apagarItemPedido(produto);
    this.itens.push(produto);
    this.atualizarTotalPedido();
    console.log('this.itens', this.itens, this.pedido);
  };
  apagarItemPedido(produto) {
    this.apagarProdutoPedido(produto);
    this.atualizarTotalPedido();
  }
  apagarProdutoPedido(produto) {
    var listaItens = this.itens;
    this.itens = listaItens.filter(function (element) {
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

      }
    });
    modal.onDidDismiss()
      .then((data) => {
        this.filtro = data['data']; // Here's your selected user!
        this.produtoInit();
      });

    return await modal.present();
  }
}