import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DBService } from '../../services/DB.service';
@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.scss'],
})

export class DetalhesComponent implements OnInit {

  constructor(public modalController: ModalController, public dbService: DBService) { }
  @Input() produto: any;
  vendedor_visualiza_custo: any;
  async ngOnInit() {
    let usertemp = await this.dbService.table('usuario').toArray();
    let usuario = usertemp[0];
    this.vendedor_visualiza_custo = usuario.vendedor_visualiza_custo;
  }
  dismiss() {
    console.log('dismass');
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
