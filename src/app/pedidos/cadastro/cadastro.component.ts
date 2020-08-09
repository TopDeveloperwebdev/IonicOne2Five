import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular'
import { DBService } from '../../services/DB.service';
import { promise } from 'protractor';

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
  constructor(
    public route: ActivatedRoute,
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public dbService: DBService) { }

  async ngOnInit() {
    const self = this;
    const loading = await self.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();

    self.nomecliente = self.route.snapshot.params['nomecliente'];
    let pedido = JSON.parse(self.route.snapshot.params['pedido']);

    self.cliente = pedido;

    let dataHora = pedido.data_entrega.split(" ");
  

    pedido.data_entrega = dataHora[0];
    self.pedido = pedido; 
   console.log('self pedido', self.pedido);
    this.condicoes = await this.dbService.table('condicoe').toArray();
    this.condicoes = this.condicoes[0];
    this.formas = await this.dbService.table('forma').toArray();
    this.formas = this.formas[0];
    this.tabelas = await this.dbService.table('tabela').toArray();
    this.tabelas = this.tabelas[0];
    this.tipos = [
      { codigo: "P", nome: "Pedido" },
      { codigo: "B", nome: "Bônus" },
      { codigo: "T", nome: "Troca" },
      { codigo: "O", nome: "Orçamento" }
    ];

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
      this.pedido.codigo_tabela_preco = this.tabelas[0].tabela_id;
      loading.dismiss();
    }, error => {
      loading.dismiss();
      self.presentConfirm();
    });

  }

  async getItensPedido(pedido_id) {
    const self = this;
    var itensArray = [];
    var produtosArray = [];
    return new Promise((resolve, reject) => {
      self.dbService.table('itempedido').toArray().then(
        res => {
          let itens = res[0].filter(function (where) {
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

}
