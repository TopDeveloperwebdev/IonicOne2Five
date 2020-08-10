import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-filtro-pedidos',
  templateUrl: './filtro-pedidos.component.html',
  styleUrls: ['./filtro-pedidos.component.scss'],
})
export class FiltroPedidosComponent implements OnInit {
  @Input() filtro: any;
  constructor(public modalController: ModalController,) { }

  ngOnInit() { }
  dismiss() {
    console.log('dismass');
    this.modalController.dismiss(this.filtro);
  }

  limparFiltro = function () {
    this.filtro = {};
    this.modalController.dismiss(this.filtro);
  }
}
