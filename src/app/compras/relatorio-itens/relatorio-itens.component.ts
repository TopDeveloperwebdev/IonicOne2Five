import { Component, OnInit } from '@angular/core';
import { DBService } from '../../services/DB.service';
import { ModalController } from '@ionic/angular'
import { FiltroComponent } from '../filtro/filtro.component';
import { RelatorioComprasComponent } from '../relatorio-compras/relatorio-compras.component';
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
    self.getComprasItens();
  }

  getComprasItens() {
    let self = this;
    self.db.compras_item
      .toArray()
      .then(function (res) {
        console.log('item', res);

        self.comprasDataservice = self.getGroupTables(res);
        self.pushClients(self.page_limit);
        // self.filterItems(filtro, res).then(filterItems => {

        // })

      });
  }
  getGroupTables(ciTable) {

    let ci_cp = {};
    ciTable.map((ci) => {
      let rowKey = ci.compras_item_codigoproduto + ci.compras_item_descricaoproduto + ci.compras_item_unidadadeproduto;
      if (!ci_cp[rowKey]) {
        ci_cp[rowKey] = { cliente_nome: '', quant: 0, total_item: 0, total_desconto: 0, total_comissao: 0 };
      }
      ci_cp[rowKey].compras_item_codigoproduto = ci.compras_item_codigoproduto;
      ci_cp[rowKey].compras_item_descricaoproduto = ci.compras_item_descricaoproduto;
      ci_cp[rowKey].compras_item_unidadadeproduto = ci.compras_item_unidadadeproduto;
      ci_cp[rowKey].compras_item_precototal = ci.compras_item_precototal;
      ci_cp[rowKey].compras_item_comissaovaloritem = ci.compras_item_comissaovaloritem;
      ci_cp[rowKey].quant += Number(ci.compras_item_quantidade);
      ci_cp[rowKey].total_item += Number(ci.compras_item_precototal);
      ci_cp[rowKey].total_desconto += (Number(ci.compras_item_precotabela) -
        Number(ci.compras_item_precounitario)) * ci.compras_item_quantidade;
      ci_cp[rowKey].total_comissao += Number(ci.compras_item_comissaovaloritem);
    })
    let items = [];
    Object.values(ci_cp).forEach(value => {
      items.push(value);
    });


    return items;
  }
  Floor(number) {
    return Math.floor(number).toFixed(2)
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
  // async filterModal() {
  //   let self = this;
  //   const modal = await this.modalCtrl.create({
  //     component: FiltroComponent,
  //     cssClass: 'my-custom-class',
  //     componentProps: {
  //       'filtro': this.filtro,
  //     }
  //   });
  //   modal.onDidDismiss()
  //     .then((data) => {
  //       let filtro = data['data'];
  //       self.getComprasItens(filtro);
  //     });

  //   return await modal.present();
  // }
  async detailItem(code) {
    let self = this;
    const modal = await this.modalCtrl.create({
      component: RelatorioComprasComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'code': code,
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        let filtro = data['data'];
        self.getComprasItens();
      });

    return await modal.present();
  }

  totalCompras(filtro) {
    var total = 0.00;
    if (typeof filtro != 'undefined' && filtro.length > 0) {

      filtro.map(function (c, index) {
        total += Number(c.compras_item_precototal);
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
        total += parseFloat(filtro[i].compras_item_comissaovaloritem);
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

  }

}
