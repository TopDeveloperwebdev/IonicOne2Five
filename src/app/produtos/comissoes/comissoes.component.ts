import { Component, OnInit, Input } from '@angular/core';
import { DBService } from '../../services/DB.service';
import { LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-comissoes',
  templateUrl: './comissoes.component.html',
  styleUrls: ['./comissoes.component.scss'],
})
export class ComissoesComponent implements OnInit {
  @Input() produto_id: any;
  db: any;
  comissoes_produto: any;
  constructor(
    public dbService: DBService,
    public loadCtrl: LoadingController,
    public modalController : ModalController
  ) {
    this.db = dbService;
  }

  async ngOnInit() {
    this.comissoes_produto = await this.db.comissao.where('produto_id').equals(this.produto_id).toArray();
  }

  toNumber(string) {
    var number = string.replace(/([.])/g, '');
    return number.replace(',', '.');
  }
  dismiss() {
    console.log('dismass');
    this.modalController.dismiss();
  }

}
