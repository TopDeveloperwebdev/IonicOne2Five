import { Component, OnInit } from '@angular/core';
import { DBService } from '../../services/DB.service';
import { ModalController } from '@ionic/angular'

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
  itens= [];
  constructor(public dbService: DBService, public modalCtrl: ModalController) {
    this.db = dbService;
  }


  ngOnInit() {
    let self = this;
    self.getComprasItens();
  }

  getComprasItens() {
    let self = this;
    self.db.compras_item
      .toArray()
      .then(function (res) {
        self.comprasDataservice = res;
        self.pushClients(self.page_limit);
      });
  }
  pushClients(page_limit) {   
    this.itens = this.comprasDataservice.slice(0, page_limit);
    
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
