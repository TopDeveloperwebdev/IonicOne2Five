import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
})
export class FiltroComponent implements OnInit {
  constructor(public modalController: ModalController) { }

  ngOnInit() {

  }
  dismiss() {
    console.log('dismass');
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}