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
  Copyfiltro = {};
  constructor(public modalController: ModalController,) { }

  ngOnInit() {
    this.tipos = [
      { codigo: "P", nome: "Pedido" },
      { codigo: "B", nome: "Bônus" },
      { codigo: "T", nome: "Troca" },
      { codigo: "O", nome: "Orçamento" }
    ];
     
     Object.assign(this.Copyfiltro, this.filtro)
    if (!this.filtro.hasOwnProperty('situacao')) {
      this.filtro.situacao = ""
    }
    if (!this.filtro.hasOwnProperty('tipo_pedido')) {
      this.filtro.tipo_pedido = ""
    }
    if (!this.filtro.hasOwnProperty('criterioData')) {
      this.filtro.criterioData = ""
    }

  }
  dismiss() {
    console.log('dismass');
    this.modalController.dismiss(this.Copyfiltro);
  }

  limparFiltro = function () {
    this.filtro = {};
    this.modalController.dismiss(this.filtro);
  }

  filtrarPedidos(form: NgForm) {
    if (form.valid) {
      if (this.filtro.situacao == "") {
        delete this.filtro.situacao;
      }
      if (this.filtro.tipo_pedido == "") {
       delete this.filtro.tipo_pedido ;
      }
      if (this.filtro.criterioData == "") {
        delete this.filtro.criterioData;
      }
      this.modalController.dismiss(this.filtro);
    }

  }

}
