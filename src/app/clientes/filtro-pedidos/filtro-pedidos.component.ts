import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-filtro-pedidos',
  templateUrl: './filtro-pedidos.component.html',
  styleUrls: ['./filtro-pedidos.component.scss'],
})
export class FiltroPedidosComponent implements OnInit {
  @Input() filtro: any;
  tipos: any;
  constructor(public modalController: ModalController,) { }

  ngOnInit() {
    this.tipos = [
      { codigo: "P", nome: "Pedido" },
      { codigo: "B", nome: "Bônus" },
      { codigo: "T", nome: "Troca" },
      { codigo: "O", nome: "Orçamento" }
    ];

  }
  dismiss(filtro) {
    console.log('dismass');
    this.modalController.dismiss(filtro);
  }

  limparFiltro = function () {
    this.filtro = {};
    this.modalController.dismiss(this.filtro);
  }
  filtrarPedidos() {
    console.log('filtro' , this.filtro);
    this.dismiss(this.filtro);

  }
}
