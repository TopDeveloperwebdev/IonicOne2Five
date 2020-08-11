import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { FiltroPedidosComponent } from './filtro-pedidos/filtro-pedidos.component';
import { DBService } from '../services/DB.service';

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

  constructor(
    public dbService: DBService,
    public navCtl: NavController,
    public modalController: ModalController,
    public loadCtrl: LoadingController) {
    this.db = dbService;
  }

  async ngOnInit() {
    const loading = await this.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();
    let self = this;
    self.pedidostodos = [];
    self.executaFiltro = true;
    this.listaPedidosTodos().then(function (res) {
      self.pedidostodos = res;
      loading.dismiss();
    });


  }

  async listaPedidosTodos() {
    var prodArray = [];
    let self = this;
    let tempPedidos = [];
    self.db.pedido
      .orderBy("data_entrega")
      .desc()
      .toArray()
      .then(function (pedidos) {
        pedidos.map((pedido) => {         
          var p;
          p = pedido;

          // if (!p.hasOwnProperty("enviado")) {
          //   p.enviado = "S";
          // }
          // if (!p.hasOwnProperty("enviado")) {
          //   p.enviado = "S";
          // }
        
          // self.db.clientes.toArray()
          //   .where("cli_id")
          //   .equals(p.cliente_id)
          //   .first()
          //   .then(function (res) {             
          //     if (res.hasOwnProperty("cli_razaosocial")) {
          //       p.nomecliente = res.cli_razaosocial;
          //     } else {
          //       p.nomecliente = res.cli_fantasia;
          //     }

          //     var entrega = p.data_entrega.split(" ");
          //     p.data_entrega = entrega[0];
          //     tempPedidos.push(p);
          //   });
            
        });
        tempPedidos = self.filterItems(self.filtro, pedidos);
      
        return new Promise((resolve, reject) => {
          return resolve(tempPedidos);
        })
      });

  }


  filterItems(filtro, pedidostodos) {
    const self = this;
    const filters = pedidostodos.filter(function (where) {
      const comando = [];
      let cData;
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
        comando.push(dateRange);
      }
      if (filtro.hasOwnProperty('tipo_pedido')) {
        tipo_pedido = (where.tipo_pedido == filtro.tipo_pedido);
      }
      if (filtro.hasOwnProperty('situacao')) {
        situacao = (where.situacao == filtro.situacao);
      }
      return (dateRange && tipo_pedido && situacao)
    });
    return filters;
  };
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
      component: FiltroPedidosComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'filtro': this.filtro,

      }
    });
    modal.onDidDismiss()
      .then((data) => {
        this.filtro = data['data']; // Here's your selected user!
        this.listaPedidosTodos();
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
