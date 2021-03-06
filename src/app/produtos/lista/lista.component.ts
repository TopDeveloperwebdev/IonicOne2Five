import { Component, OnInit } from '@angular/core';
import { dataService } from '../../services/data.service';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { DetalhesComponent } from '../detalhes/detalhes.component';
import { FiltroComponent } from '../filtro/filtro.component';
import { DBService } from '../../services/DB.service';
import { ComissoesComponent } from '../comissoes/comissoes.component';
import { FotosComponent } from '../fotos/fotos.component'
@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {

  page_limit = 50;
  increaseItems = 50;
  pagina = 0;
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

  async ngOnInit() {
    this.filtro = {};
    this.tabelas = await this.db.tabela.toArray();
    this.tabela_id = this.tabelas[0].tabela_id;
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
      message: 'Nenhum Produto Localizado com o Filtro Utilizado',
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
    const loading = await this.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();
    let self = this;

    this.ListaProdutos(filtro, this.pagina, this.page_limit).then(res => {
      console.log('ListaProdutos', res, filtro, self.tabela_id);
      let produtos;
      produtos = res;
      produtos.sort(this.compare);
      this.listaProdutos = produtos.map(function (produto, index) {
        var p;
        p = produto;

        p.precotabela = "";

        self.db.produto_tabela.where('[produto_id+tabela_id]')
          .equals([p.produto_id, self.tabela_id.toString()])
          .first()
          .then(function (res) {
            if (res && res.precotabela) {
              p.precotabela = self.toNumber(res.precotabela);
            }
            return p;

          });
        return p;
      });
      console.log('this.listaProdutos',this.listaProdutos.length);
      // this.pushProducts(this.page_limit);
      if (!res['length']) {
        this.ErrorConfirm();
      }
      loading.dismiss();
    },
      err => {
        loading.dismiss();
        this.presentConfirm();
      })
  }
  toNumber(string) {
    var number = string.replace(/([.])/g, '');
    return number.replace(',', '.');
  }
  pushProducts(page_limit) {
    this.listaProdutos = this.listaProdutosDataservice.slice(0, page_limit);
    console.log(';listaProdutos', this.listaProdutos);
  }

  async ListaProdutos(filtro, pagina, page_limit) {

    if (!isNaN(this.tabela_id)) {
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



      return new Promise((resolve, reject) => {
        return resolve(DB_Produto.offset(pagina * page_limit)
          .limit(page_limit).toArray());
      })

    }
  }


  async Comissoes(produto_id) {
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

  loadMore($event) {
    let self = this;
    return new Promise((resolve) => {
      setTimeout(() => {
        // if (self.listaProdutosDataservice.length > self.page_limit + self.increaseItems) {
        //   self.page_limit = self.page_limit + self.increaseItems;
        //   self.pushProducts(self.page_limit);
        // }
        this.pagina++;         
       
        this.ListaProdutos(this.filtro, this.pagina, this.page_limit).then(res => {     
          let produtos;
          produtos = res;
         
          
          let templistaProdutos = produtos.map(function (produto, index) {
            var p;
            p = produto;
    
            p.precotabela = "";
    
            self.db.produto_tabela.where('[produto_id+tabela_id]')
              .equals([p.produto_id, self.tabela_id.toString()])
              .first()
              .then(function (res) {
                if (res && res.precotabela) {
                  p.precotabela = self.toNumber(res.precotabela);
                }
                return p;
    
              });
            return p;
          });
          this.listaProdutos =  this.listaProdutos.concat(templistaProdutos);  
          this.listaProdutos.sort(this.compare); 
        })
        
        $event.target.complete();
        resolve();
      }, 500);
    })

  }


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
      componentProps: {
        filtro: this.filtro,
        tabela_id: this.tabela_id
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data['data']) {
          this.filtro = data['data'].filtro;
          this.tabela_id = data['data'].tabela_id;
          console.log('this.ta', this.tabela_id);
          this.pagina = 0;
          this.produtoInit(this.filtro);
        }


      });
    return await modal.present();
  }
}
