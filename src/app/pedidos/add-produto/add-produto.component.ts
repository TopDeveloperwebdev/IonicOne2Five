import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { DBService } from '../../services/DB.service'
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
  usuario: any;
  page_limit = 50;
  increaseItems = 50;
  @Input() pedido: any;
  constructor(public loadCtrl: LoadingController, public alertCtrl: AlertController, public dbService: DBService,) {
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
    const loading = await this.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();

    this.ListaProdutos(this.filtro).then(res => {
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
    this..dismiss({
      'dismissed': true
    });
  }

}