import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular'
@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
})
export class FiltroComponent implements OnInit {
  filtro = {}
  constructor(public modalController: ModalController) { }

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
