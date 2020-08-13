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
    this.filtro = {};
    this.listaPedidos(this.filtro);
  }
  async listaPedidos(filtro) {
    const self = this;
    if (self.cliente_id) {
      self.items = await this.db.titulo
        .where('cliente_id')
        .equals(Number(self.cliente_id))
        .toArray();

      this.filterItems(filtro);
    } else {

      self.items = await this.db.titulo.toArray();
      console.log('items', self.items);
      this.filterItems(filtro);
    }
  }

  filterItems(filtro) {
    const self = this;
    let tempItems = self.items;
    self.items = tempItems.filter(function (where) {
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

  }
  async filter() {
    let self = this;
    const modal = await this.modalController.create({
      component: FiltroComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'filtro': this.filtro,

      }
    });
    modal.onDidDismiss()
      .then((data) => {
        self.filtro = data['data']; // Here's your selected user!

        self.listaPedidos(self.filtro);
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
