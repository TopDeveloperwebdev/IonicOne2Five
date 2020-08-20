import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DBService} from '../../services/DB.service';
@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
})
export class FiltroComponent implements OnInit {
  filtro : any;  
  db : any;
  responsaveis : any;
  constructor(public modalController: ModalController , public dbService : DBService) { 
  this.db = dbService;

  }

 async ngOnInit() { 
    this.filtro = {};
    this.responsaveis = await this.db.responsavel.toArray();  
  
  }
  dismiss(filtro) {
  
    this.modalController.dismiss(filtro);
  }


  filtrarTitulos(form : NgForm){
    if(form.valid){
      console.log('this.', this.filtro);
      this.modalController.dismiss(this.filtro);
    } 
  }
}
