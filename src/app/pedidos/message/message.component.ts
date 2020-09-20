import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DBService } from '../../services/DB.service';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  pedido: any;
  cliente_id: ''
  db: any
  itens : any
  constructor(
    public route: ActivatedRoute,
    public dbService: DBService,
  ) {
    this.db = dbService;
  }

  ngOnInit() {
    this.itens =[];
    this.pedido = JSON.parse(this.route.snapshot.params['pedido']);
    this.cliente_id = this.route.snapshot.params['cliente_id'];
    console.log('pedido', this.pedido);
    let pedido_id;
    if (isNaN(this.pedido.pedido_id)) {
      pedido_id = this.pedido.cod_pedido_mob;
    } else {
      pedido_id = this.pedido.pedido_id;
    }
   this.getItensPedido(pedido_id).then(res => {
    this.itens = res;
    console.log('this ' , this.itens);
   });
  }
  async getItensPedido(pedido_id) {
    const self = this;
    var itensArray = [];
    var produtosArray = [];
    return new Promise((resolve, reject) => {
      self.db.itempedido
        .where('pedido_id')
        .equals(pedido_id)
        .toArray()
        .then(
          itens => {

            if (itens.length) {
              itens.map((item, index) => {
                var i;
                i = item;
                return self.dbService.table('produto')
                  .where('produto_id')
                  .equals(i.codigo_produto)
                  .first().then(res => {
                    let prod;
                    prod = res;
                    i.descricao = prod && prod.descricaoproduto ?
                      prod.descricaoproduto :
                      "N/I";

                    itensArray.push(i);
                    if (index == itens.length - 1) {
                      return resolve(itensArray);
                    }
                  })
              });
            } else {
              return resolve(itensArray);
            }

          },
          err => {
            return reject(err);
          });
    });

  }
}
