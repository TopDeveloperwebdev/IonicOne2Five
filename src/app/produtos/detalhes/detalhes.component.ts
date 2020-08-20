import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.scss'],
})

export class DetalhesComponent implements OnInit {

  constructor(public modalController: ModalController) { }
  @Input() produto: any;
  ngOnInit() {
    console.log('produto',this.produto);
   }
  dismiss() {
    console.log('dismass');
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
