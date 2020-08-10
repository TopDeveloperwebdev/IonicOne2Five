import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
@Component({
  selector: 'app-detalhes-produto',
  templateUrl: './detalhes-produto.component.html',
  styleUrls: ['./detalhes-produto.component.scss'],
})
export class DetalhesProdutoComponent implements OnInit {
  @Input() produtoEscolhido: any;
  constructor(public modalCtrl: ModalController) { }

  ngOnInit() { }
  dismiss() {
    console.log('dismass');
    this.modalCtrl.dismiss();
  }
}
