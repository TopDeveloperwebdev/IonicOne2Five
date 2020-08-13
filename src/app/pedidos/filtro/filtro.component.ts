import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular'
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
})
export class FiltroComponent implements OnInit {
  @Input() filtro: any;
  tipos: any;
  constructor(public modalController: ModalController,) { }

  ngOnInit() {
    this.filtro = {};
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

  filtrarPedidos(form: NgForm) {
    if (form.valid) {
      console.log('this.', this.filtro);
      this.modalController.dismiss(this.filtro);
    }

  }

}
