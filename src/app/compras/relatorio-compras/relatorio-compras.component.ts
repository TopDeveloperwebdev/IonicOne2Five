import { Component, OnInit, Input } from '@angular/core';
import { DBService } from '../../services/DB.service';
import { ModalController } from '@ionic/angular'

import { Observable, BehaviorSubject, forkJoin, from } from 'rxjs';

@Component({
  selector: 'app-relatorio-compras',
  templateUrl: './relatorio-compras.component.html',
  styleUrls: ['./relatorio-compras.component.scss'],
})
export class RelatorioComprasComponent implements OnInit {
  db: any;
  itens: any;
  @Input() code: any;

  constructor(public dbService: DBService, public modalCtrl: ModalController) {
    this.db = dbService;
  }
  ngOnInit() {
    let self = this;
    this.itens = [];
    self.getComprasItens(this.code);
  }

  getComprasItens(code) {
    let self = this;
    forkJoin([
      self.db.compras_item
        .where("compras_item_codigoproduto")
        .equals(code)
        .toArray()
        .then(function (res1) { return res1 }),
      self.db.compras
        .toArray()
        .then(function (res2) { return res2 })
    ]).subscribe(res => {    
      self.itens = this.getGroupTables(res[0], res[1]);
     
    })


  }
  Floor(number) {
    return Math.floor(number).toFixed(2)
  }
  getGroupTables(ciTable, cpTable) {
    let ci_cp = {};
    cpTable.map((cp) => {
      if (cp.compras_cliente_nome) {
        let rowKey = cp.compras_cliente_nome;
        if (!ci_cp[rowKey]) {
          ci_cp[rowKey] = { cliente_nome: '', quant: 0, total_item: 0, total_desconto: 0, total_comissao: 0 };
        }
        ciTable.map((ci) => {
          if (ci.compras_id === cp.compras_id && ci) {
            ci_cp[rowKey].cliente_nome = rowKey;
            ci_cp[rowKey].quant += Number(ci.compras_item_quantidade);
            ci_cp[rowKey].total_item += Number(ci.compras_item_precototal);
            ci_cp[rowKey].total_desconto += (Number(ci.compras_item_precotabela) -
              Number(ci.compras_item_precounitario)) * ci.compras_item_quantidade;
            ci_cp[rowKey].total_comissao += Number(ci.compras_item_comissaovaloritem);
          }

        })
      }    

    });
    let items = [];
    Object.values(ci_cp).forEach(value => {
     items.push(value);
    });
    return items;
  }
  dismiss(filtro) {
  
    this.modalCtrl.dismiss(filtro);
  }


}
