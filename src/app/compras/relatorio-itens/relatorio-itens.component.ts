import { Component, OnInit } from '@angular/core';
import { DBService } from '../../services/DB.service';
import { ModalController } from '@ionic/angular'
import { FiltroComponent } from '../filtro/filtro.component';
@Component({
  selector: 'app-relatorio-itens',
  templateUrl: './relatorio-itens.component.html',
  styleUrls: ['./relatorio-itens.component.scss'],
})
export class RelatorioItensComponent implements OnInit {
  db: any;
  page_limit = 50;
  increaseItems = 50;
  comprasDataservice: any;
  itens = [];
  filtro: any;
  constructor(public dbService: DBService, public modalCtrl: ModalController) {
    this.db = dbService;
  }


  ngOnInit() {
    let self = this;
    self.filtro = {};
    self.getComprasItens(self.filtro);
  }

  getComprasItens(filtro) {
    let self = this;
    self.db.compras_item
      .toArray()
      .then(function (res) {
       
        self.filterItems(filtro, res).then(filterItems => {     
         self.comprasDataservice = filterItems;          
          self.pushClients(self.page_limit);
        })

      });
  }

  async filterItems(filtro, res) {
    const self = this;
    let filterItems = res.filter(function (where) {
      let dateRange;
      let dataInicio = Date.parse(filtro.inicio);
      let dataFim = Date.parse(filtro.fim);
      let dataResponsavel_id = filtro.responsavel_id;
      let responsavel_id = true;
      dateRange = true;
      if (filtro.hasOwnProperty('inicio')) {
        dateRange = (Date.parse(where.dataemissao) >= dataInicio && Date.parse(where.dataemissao) <= dataFim)
      }
      if (filtro.hasOwnProperty('fim')) {
        dateRange = (Date.parse(where.datavenciment) >= dataInicio && Date.parse(where.datavenciment.substring) <= dataFim)
      }
      if (filtro.hasOwnProperty('responsavel_id')) {
        responsavel_id = (where.responsavel_id == dataResponsavel_id)
      }
      return dateRange && responsavel_id;
    });
    return new Promise((resolve, reject) => {
      return resolve(filterItems);
    })

  }
  pushClients(page_limit) {
    this.itens = this.comprasDataservice.slice(0, page_limit);

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
        self.getComprasItens(filtro);
      });

    return await modal.present();
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
}
