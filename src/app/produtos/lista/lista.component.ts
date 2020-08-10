import { Component, OnInit } from '@angular/core';
import { dataService } from '../../services/data.service';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { DetalhesComponent } from '../detalhes/detalhes.component';
import { FiltroComponent } from '../filtro/filtro.component';
import { DBService } from '../../services/DB.service'
@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {

  page_limit = 50;
  increaseItems = 50;
  usuario: any;
  produtosDataservice: any;
  comissoes: any;
  marcas: any;
  produtos: any;
  tabelas: any;
  tipos: any;

  db: any;
  filtro = {};
  listaProdutosDataservice: any
  listaProdutos: any;
  tipoPesquisa: any;
  pesquisas: any;
  tabela_id: any;
  constructor(
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public dbService: DBService,
    public modalCtrl: ModalController) {
    this.db = dbService;
    this.usuario = JSON.parse(localStorage.getItem('user'));
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
    this.tabelas = await this.db.tabela.toArray();
    this.tabela_id = this.tabelas[0].tabela_id;

    this.pesquisas = [
      {
        id: 1,
        descricao: 'Pesquisa Geral'
      },
      {
        id: 2,
        descricao: 'Pesquisa Início Descrição'
      }
    ];

    this.tipoPesquisa = this.pesquisas[0].id;
    this.ListaProdutos(this.filtro).then(res => {
      this.listaProdutosDataservice = res;
      this.pushProducts(this.page_limit);
      loading.dismiss();
    },
      err => {
        loading.dismiss();
        this.presentConfirm();
      })
  }
  pushProducts(page_limit) {
    this.listaProdutos = this.listaProdutosDataservice.slice(0, page_limit);
  }

  async ListaProdutos(filtro) {

    if (!isNaN(this.tabela_id)) {
      console.log('filtor', filtro);
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
    let self = this;
    return new Promise((resolve) => {
      setTimeout(() => {
        if (self.listaProdutosDataservice.length > self.page_limit + self.increaseItems) {
          self.page_limit = self.page_limit + self.increaseItems;
          self.pushProducts(self.page_limit);
        }
        $event.target.complete();
        resolve();
      }, 500);
    })

  };

  async detalhes(product0) {
    const modal = await this.modalCtrl.create({
      component: DetalhesComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        produto: product0
      }
    });
    return await modal.present();
  }
  async filter() {
    const modal = await this.modalCtrl.create({
      component: FiltroComponent,
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }
}
