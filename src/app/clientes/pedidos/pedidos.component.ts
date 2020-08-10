import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DBService } from '../../services/DB.service';
import { NavController, ModalController } from '@ionic/angular';
import { FiltroPedidosComponent } from '../filtro-pedidos/filtro-pedidos.component'
@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {
  pedidos = [];

  filtro = {};
  nomecliente = '';
  cliente_id: '';

  constructor(public route: ActivatedRoute, public dbService: DBService, public navCtl: NavController, public modalController: ModalController) {

    this.cliente_id = this.route.snapshot.params['cliente_id'];

    this.nomecliente = this.route.snapshot.params['nomecliente'];


  }

  ngOnInit() {
    this.listaPedidos(this.cliente_id);
  }
  async listaPedidos(cliente_id) {
    const self = this;
    self.pedidos = [];
    return this.dbService.table('pedido').toArray().then(res => {
      return res[0].filter(function (where) {
        return where.cliente_id === Number(self.cliente_id);
      })
    }).then(function (pedidos) {
      self.pedidos = pedidos.map(function (pedido) {
        if (!pedido.hasOwnProperty('enviado')) {
          pedido.enviado = 'S';
        }
        return pedido;
      });

      self.filterItems(self.filtro);

    });

  }
  filterItems(filtro) {
    const self = this;
    const filters = self.pedidos.filter(function (where) {
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

    self.pedidos = filters;
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
        this.listaPedidos(this.cliente_id);
      });

    return await modal.present();
  }
}
