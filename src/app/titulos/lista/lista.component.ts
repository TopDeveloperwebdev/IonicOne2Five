import { Component, OnInit } from '@angular/core';
import { DBService } from '../../services/DB.service';
import { NavController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FiltroComponent } from '../filtro/filtro.component'
@Component({
  selector: 'app-titulos',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {
  items = [];
  filtro: any;
  nomeCliente = "ADONAL RACOES E BAZAR LTDA ME";
  db: any;
  cliente_id: any;

  constructor(
    public route: ActivatedRoute,
    public dbService: DBService,
    public navCtl: NavController,
    public modalController: ModalController) {
    this.cliente_id = this.route.snapshot.params['cliente_id'];
    this.nomeCliente = this.route.snapshot.params['nomecliente'];
    this.db = dbService;
  }

  ngOnInit() { 
    this.listaPedidos(this.filtro);
  }
  async listaPedidos(filtro) {
    const self = this;
   
    self.items = await this.db.titulo
      .where('cliente_id')
      .equals(Number(self.cliente_id))      
      .toArray();       
  }

  filterItems(filtro) {
    const self = this;
    // const filters = self.items.filter(function (where) {
    //   const comando = [];
    //   let cData;
    //   let dateRange = true;
    //   let tipo_pedido = true;
    //   let situacao = true;
    //   if (filtro.hasOwnProperty('inicio')) {
    //     let dataInicio = Date.parse(filtro.inicio);
    //     let dataFim = Date.parse(filtro.fim);
    //     if (cData === 'C') {
    //       dateRange = (Date.parse(where.data_gravacao + ' 00:00:00') >=
    //         dataInicio && Date.parse(where.data_gravacao + ' 00:00:00') <= dataFim)
    //     } else {
    //       dateRange = (Date.parse(where.data_entrega.substring(0, 10) + ' 00:00:00') >=
    //         dataInicio && Date.parse(where.data_entrega.substring(0, 10) + ' 00:00:00') <= dataFim)
    //     }
    //     comando.push(dateRange);
    //   }     
    //   return (dateRange)
    // });
    //self.items = filters;
  };
  async filter() {
    const modal = await this.modalController.create({
      component: FiltroComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'filtro': this.filtro,

      }
    });
    modal.onDidDismiss()
      .then((data) => {
        this.filtro = data['data']; // Here's your selected user!
        this.listaPedidos(this.filtro);
      });

    return await modal.present();
  }
  totalTitulos(filtro) {
    if (typeof filtro != 'undefined' && filtro.length > 0) {
      var total = 0.00;
      for (var i in filtro) {
        total += parseFloat(filtro[i].valor);
      }

      return total.toFixed(2);
    } else {
      return 0;
    }
  }

}
