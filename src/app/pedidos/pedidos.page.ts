import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { FiltroComponent } from './filtro/filtro.component'
import { DBService } from '../services/DB.service';
import { promise } from 'protractor';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})

export class PedidosPage implements OnInit {
  pedidos = [];

  filtro = {};
  nomecliente = '';
  cliente_id: '';
  pedidostodos: any;
  executaFiltro: any;
  db: any;
  pedidostodosLength = 0;
  constructor(
    public dbService: DBService,
    public navCtl: NavController,
    public modalController: ModalController,
    public loadCtrl: LoadingController) {
    this.db = dbService;
    this.pedidostodos = [];
  }

  async ngOnInit() {

    const loading = await this.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();
    let self = this;

    self.executaFiltro = true;
    let filtro = {};
    self.pedidostodos = await this.listaPedidosTodos(filtro);

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
                if (res.hasOwnProperty("cli_razaosocial")) {
                  p.nomecliente = res.cli_razaosocial;
                } else {
                  p.nomecliente = res.cli_fantasia;
                }

                var entrega = p.data_entrega.split(" ");
                p.data_entrega = entrega[0];
                tempPedidos.push(p);
                if (pedidos.length - 1 == index) {


                  self.filterItems(filtro, tempPedidos).then(res => {
                    return resolve(res);
                  })

                }
              });
          });
        })
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
  // async filterItems(filtro, res) {
  //   const self = this;

  //   console.log('res', filtro);

  //   let resultItems = res.filter( where=> {
  //     let dateRange;
  //     let dataInicio = Date.parse(filtro.inicio);
  //     let dataFim = Date.parse(filtro.fim);
  //     let datatipo_pedido = filtro.tipo_pedido;
  //     let datasituacao = filtro.situacao;
  //     dateRange = true;
  //     let tipo_pedido = true;
  //     let situacao = true;
  //     let enviado = false;
  //     console.log('filtro' , where , filtro);
  //     if (filtro.hasOwnProperty('inicio')) {
  //       dateRange = (Date.parse(where.data_gravacao) >= dataInicio && Date.parse(where.data_gravacao) <= dataFim)
  //     }
  //     if (filtro.hasOwnProperty('fim')) {
  //       dateRange = (Date.parse(where.data_entrega) >= dataInicio && Date.parse(where.data_entrega) <= dataFim)
  //     }
  //     if (filtro.hasOwnProperty('tipo_pedido')) {
  //       tipo_pedido = (where.tipo_pedido == filtro.tipo_pedido);
  //     }
  //     if (filtro.hasOwnProperty('situacao')) {
  //       situacao = (where.situacao == filtro.situacao);
  //     }
  //     if (where.hasOwnProperty('enviado') && where.enviado == 'N') {
  //       enviado = true;
  //     } else if (where.hasOwnProperty('enviado') && where.enviado == 'S' && Date.parse(Date()) == Date.parse(where.data_gravacao.substring(0, 10))) {
  //       enviado = true;
  //     }
  //     return (dateRange && tipo_pedido && situacao && enviado);

  //   });

  //   return new Promise((resolve, reject) => {
  //     return resolve(resultItems);
  //   })

  // }
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
  };
  cadastro(cliente_id, nomecliente) {
    this.navCtl.navigateForward(['pedidos/cadastro', { 'cliente_id': cliente_id, 'nomecliente': nomecliente }]);
  }
  alterar(p, nomecliente) {
    let pedido = JSON.stringify(p);
    this.navCtl.navigateForward(['pedidos/cadastro', { 'pedido': pedido, 'nomecliente': nomecliente }]);
  };
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
        let filtro = data['data']; // Here's your selected user!
        this.listaPedidosTodos(filtro);
      });

    return await modal.present();
  }

  // filter('filtroInicial', function($filter){
  //   return function(input, executaFiltro){
  //     var filtro = [];
  //     if(typeof input != 'undefined' && typeof executaFiltro != 'undefined'){
  //       input.map(function(value){

  //         if(value.hasOwnProperty('enviado') && value.enviado == 'N'){
  //           filtro.push(value);
  //         }else if(value.hasOwnProperty('enviado') &&
  //           value.enviado == 'S' &&
  //           Date.parse(new Date()) == Date.parse(value.data_gravacao.substring(0, 10))){
  //           filtro.push(value);
  //         }
  //       });
  //       return filtro;
  //     }else{
  //       return input;
  //     }
  //   }
  // });
}
