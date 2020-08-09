import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular'
import { DBService } from '../../services/DB.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent implements OnInit {
  nomecliente: any;
  urgente: any;
  pedido: any;
  itens: any;
  cliente: any;
  constructor(
    public route: ActivatedRoute,
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public dbService: DBService) { }

  async ngOnInit() {
    // const loading = await this.loadCtrl.create({
    //   message: 'Aguarde!'
    // });
    // loading.present();

    this.nomecliente = this.route.snapshot.params['nomecliente'];
    this.pedido = JSON.parse(this.route.snapshot.params['pedido']);
    this.cliente = this.pedido;

    console.log('pedido', this.pedido);
    this.pedido.urgente = this.pedido.urgente == "S" ? true : false;
    let pedido_id;

    if (isNaN(this.pedido.pedido_id)) {
      pedido_id = this.pedido.cod_pedido_mob;
    } else {
      pedido_id = this.pedido.pedido_id;
    }
    this.getItensPedido(pedido_id);
    //.then(
    // function (res) {
    //   var dataHora = pedido.data_entrega.split(" ");
    //   var dataSplit = dataHora[0].split("-");
    //   var data = new Date(
    //     dataSplit[0],
    //     parseInt(dataSplit[1]) - 1,
    //     dataSplit[2]
    //   );

    //   pedido.data_entrega = data;
    //   $scope.pedido = pedido;
    //   $scope.itens = res;
    //   $ionicLoading.hide();
    // },
    // function (err) {
    //   console.log(err);
    //   $ionicLoading.hide();

    //   $ionicPopup.alert({
    //     title: "Atenção!",
    //     template: "Problema ao carregar itens do pedido. Tente novamente.",
    //     buttons: [{
    //       text: "OK",
    //       type: "button-assertive"
    //     }]
    //   });
    // }
    //);



  }

  getItensPedido(pedido_id) {
    console.log("getItensPedido", pedido_id);


    var itensArray = [];
    var produtosArray = [];

    this.dbService.table('itempedido').toArray().then(res => {
      return res[0].filter(function (where) {
        return where.pedido_id == pedido_id;
      }).then(function (itens) {
        debugger;
        console.log("itens do pedido: ", itens);

      })
    })
    // .where("pedido_id")
    // .equals(pedido_id)
    // .toArray()
    // .then(
    //   function (itens) {

    // if (!itens || itens.length == 0) {
    //   deferred.resolve(itensArray);
    //   return;
    // }

    // itens.map(function (item, index) {
    //   var i = {};
    //   i = item;
    //   db.produto
    //     .where("produto_id")
    //     .equals(i.codigo_produto)
    //     .first()
    //     .then(
    //       function (prod) {
    //         i.descricao =
    //           prod && prod.descricaoproduto ?
    //             prod.descricaoproduto :
    //             "N/I";

    //         if (tabela_id) {
    //           i = recalcularItem(i, prod, tabela_id);
    //         }

    //         itensArray.push(i);

    //         if (index == itens.length - 1) {
    //           console.log(
    //             "acabou de passar pelo resolve do item index: ",
    //             index
    //           );
    //           deferred.resolve(itensArray);
    //         }
    //       },
    //       function (err) {
    //         console.log(err);
    //         deferred.reject(err);
    //       }
    //     );
    // });
    //   },
    //   function (err) {
    //     console.log(err);
    //     return err;
    //   }
    // );


  }
}
