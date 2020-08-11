import { Component, OnInit } from '@angular/core';
import { DBService } from '../../services/DB.service';
import { ItensComponent } from '../itens/itens.component';
import { ModalController } from '@ionic/angular'

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.scss'],
})
export class RelatorioComponent implements OnInit {
  db: any;
  filtro: any;
  comprasDataservice: any;
  compras: any;
  page_limit = 50;
  increaseItems = 50;
  constructor(public dbService: DBService, public modalCtrl: ModalController) {
    this.db = dbService;
  }

  ngOnInit() {
    let self = this;
    self.filtro = {};
    self.getCompras(this.filtro).then(res => {
      self.comprasDataservice = res;
      self.pushClients(this.page_limit);
    })
  }

  getCompras(filtro) {
    var DB_Compras = this.db.compras;
    this.db.compras.count().then(function (count) {
      if (filtro.hasOwnProperty('responsavel_id') && filtro.hasOwnProperty('inicio')) {
        DB_Compras = this.db.compras
          .where('compras_responsavel_id')
          .equals(filtro.responsavel_id)
          .filter(function (list) {
            return this.filter(list, filtro.inicio, filtro.fim);
          });
      } else if (filtro.hasOwnProperty('responsavel_id')) {
        DB_Compras = this.db.compras
          .where('compras_responsavel_id')
          .equals(filtro.responsavel_id);
      } else if (filtro.hasOwnProperty('inicio')) {
        DB_Compras = this.db.compras
          .filter(function (list) {
            return this.filter('comprasFilter')(list, filtro.inicio, filtro.fim);
          });
      } else {
        DB_Compras = this.db.compras;
      }
    });
    return new Promise((resolve, reject) => {
      return resolve(DB_Compras.toArray())
    })

  }
  filter(input, inicio, fim) {
    var dataInicio = Date.parse(inicio);
    var dataFim = Date.parse(fim);
    var dataHoje = new Date();
    if (typeof input != 'undefined' && typeof inicio != 'undefined') {

      if (Date.parse(input.compras_datacompra) >= dataInicio &&
        Date.parse(input.compras_datacompra) <= dataFim
      ) {
        return input;
      }

    } else {
      return input;
    }

  }

  totalCompras(filtro) {
    var total = 0.00;
    if (typeof filtro != 'undefined' && filtro.length > 0) {

      filtro.map(function (c, index) {
        total += Number(c.compras_totalcompra);
      });


      return total;
    } else {
      return 0;
    }
  }
  totalComissoes(filtro) {
    if (typeof filtro != 'undefined' && filtro.length > 0) {
      var total = 0.00;
      for (var i in filtro) {
        total += parseFloat(filtro[i].compras_totalcomissao);
      }

      return total.toFixed(2);
    } else {
      return 0;
    }
  }
  pushClients(page_limit) {
    this.compras = this.comprasDataservice.slice(0, page_limit);
  }
  loadMore($event) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.comprasDataservice.length > this.page_limit + this.increaseItems) {
          this.page_limit = this.page_limit + this.increaseItems;
          this.pushClients(this.page_limit);
        }

        $event.target.complete();
        resolve();
      }, 500);
    })

  };

  mostrarItens(compras_id) {
    console.log('adfadfs');
    let itens = [];
    let self = this;
    var id = compras_id;
    this.db.compras_item.where('compras_id').equals(id).toArray().then(function (res) {
      itens = res;
      self.ShowItemModal(itens);

    });
  }
  async ShowItemModal(itens) {
    const modal = await this.modalCtrl.create({
      component: ItensComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'itens': itens,
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        let producto = data['data'];

      });

    return await modal.present();
  }
}
