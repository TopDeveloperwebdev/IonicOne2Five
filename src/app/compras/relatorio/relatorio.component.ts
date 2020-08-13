import { Component, OnInit } from '@angular/core';
import { DBService } from '../../services/DB.service';
import { ItensComponent } from '../itens/itens.component';
import { ModalController } from '@ionic/angular';
import { FiltroComponent } from '../filtro/filtro.component';

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
    this.compras = [];
    this.filtro = {};
    this.Init(this.filtro);

  }
  Init(filtro) {
    let self = this;
    self.getCompras(filtro).then(res => {   
      self.comprasDataservice = res;
      self.pushClients(this.page_limit);
    })
  }

  async getCompras(filtro) {
    let res = await this.db.compras.toArray();
    let tempItems;
    tempItems = res.filter(function (where) {
      let dateRange;
      let dataInicio = Date.parse(filtro.inicio);
      let dataFim = Date.parse(filtro.fim);
      let dataResponsavel_id = filtro.responsavel_id;
      let responsavel_id = true;
      dateRange = true;
      if (filtro.hasOwnProperty('inicio')) {
        dateRange = (Date.parse(where.compras_datacompra) >= dataInicio && Date.parse(where.compras_datacompra) <= dataFim)
      }
      if (filtro.hasOwnProperty('responsavel_id')) {
        responsavel_id = (where.compras_responsavel_id == dataResponsavel_id)
      }
      return dateRange && responsavel_id;
    });

    return new Promise((resolve, reject) => {
      return resolve(tempItems)
    })
  }

  filter(input, inicio, fim) {
    var dataInicio = Date.parse(inicio);
    var dataFim = Date.parse(fim);

    if (typeof input != 'undefined' && typeof inicio != 'undefined') {
      return (Date.parse(input.compras_datacompra) >= dataInicio &&
        Date.parse(input.compras_datacompra) <= dataFim
      );
    } else {
      return true
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
  async filterModal() {
    let self = this;
    const modal = await this.modalCtrl.create({
      component: FiltroComponent,
      cssClass: 'my-custom-class',
    });
    modal.onDidDismiss()
      .then((data) => {
        let filtro = data['data'];
        self.Init(filtro);
      });

    return await modal.present();
  }
}
