import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DBService } from '../../services/DB.service';
@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
})
export class FiltroComponent implements OnInit {
  db: any;
  responsaveis: any;
  @Input() filtro: any;
  Copyfiltro: any;
  constructor(public modalController: ModalController, public dbService: DBService) {
    this.db = dbService;

  }

  async ngOnInit() {    
    this.responsaveis = await this.db.responsavel.toArray();
    this.Copyfiltro = {};
    Object.assign(this.Copyfiltro, this.filtro);
    console.log('this' , this.filtro)
    if (!this.filtro.hasOwnProperty('responsavel_id')) {
      this.filtro.responsavel_id = ""
    }
  


  }
  dismiss() {
    this.modalController.dismiss(this.Copyfiltro);
  }


  filtrarTitulos(form: NgForm) {
    if (form.valid) {    
      if (this.filtro.responsavel_id == "") {
        delete this.filtro.responsavel_id;
      }
      this.modalController.dismiss(this.filtro);
    }
  }
}
