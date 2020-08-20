import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
})
export class FiltroComponent implements OnInit {

  @Input() filtro: any;
  constructor(public modalController: ModalController) {


  }

  ngOnInit() {
    if (!this.filtro.hasOwnProperty('situacao')) {
      this.filtro.situacao = "";
    }
  }
  dismiss(filtro) {

    this.modalController.dismiss(filtro);
  }


  filtrarTitulos(form: NgForm) {
    if (form.valid) {
      console.log('this.', this.filtro);
      if (this.filtro.situacao == "") {
        delete this.filtro.situacao;
      }
      this.modalController.dismiss(this.filtro);
    }

  }
}
