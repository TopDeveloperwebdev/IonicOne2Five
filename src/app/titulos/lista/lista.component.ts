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
    console.log('items', self.items);
  }

  filterItems(filtro) {
    const self = this;
    let tempItems = self.items;
    self.items = tempItems.filter(function (where) {
      let dataInicio = Date.parse(filtro.inicio);
      let dataFim = Date.parse(filtro.fim);
      let situacao = filtro.situacao;
      let dataHoje = new Date().toDateString();
      let filtroResult = false;
      let datavencimento = where.datavencimento.split(' ')[0];
      console.log('this.filtro', filtro, (typeof filtro.inicio != 'undefined'), (typeof situacao != 'undefined'));

      if (typeof filtro.inicio != 'undefined' && typeof situacao != 'undefined') {
        if (situacao == 'V') {
          if (Date.parse(datavencimento) >= dataInicio &&
            Date.parse(datavencimento) <= dataFim &&
            Date.parse(datavencimento) < Date.parse(dataHoje)) {
            filtroResult = true;
          }
        } else {
          if (Date.parse(datavencimento) >= dataInicio &&
            Date.parse(datavencimento) <= dataFim &&
            Date.parse(datavencimento) >= Date.parse(dataHoje)) {
            filtroResult = true;
          }
        }

      } else if (typeof filtro.inicio != 'undefined') {
        if (Date.parse(datavencimento) >= dataInicio &&
          Date.parse(datavencimento) <= dataFim) {
          filtroResult = true;
        }
        console.log('filtroResult-------', Date.parse(datavencimento),datavencimento, dataInicio, dataFim);
      } else if (typeof situacao != 'undefined') {
        if (situacao == 'A') {
          console.log('Date.parse(dataHoje)', Date.parse(dataHoje), Date.parse(datavencimento), datavencimento, dataHoje);
          if (Date.parse(datavencimento) >= Date.parse(dataHoje)) {
            filtroResult = true;
          }
        } else {
          if (Date.parse(datavencimento) < Date.parse(dataHoje)) {
            filtroResult = true;
          }
        }
      } else {
        filtroResult = true;
      }
      return filtroResult;
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

  verificaDataAtraso(data) {
    var dataHoje = new Date().toDateString();
    if (Date.parse(data) < Date.parse(dataHoje)) {
      return 'assertive';
    } else {
      return '';
    }
  }
}
