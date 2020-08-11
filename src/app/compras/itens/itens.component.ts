import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular'

@Component({
  selector: 'app-itens',
  templateUrl: './itens.component.html',
  styleUrls: ['./itens.component.scss'],
})
export class ItensComponent implements OnInit {

  @Input() itens: any;
  
  constructor(public modalController: ModalController) {

  }

  ngOnInit() {
    console.log('adsfaf', this.itens);
  }
  dismiss() {
    console.log('dismass');
    this.modalController.dismiss();
  }

 
}
