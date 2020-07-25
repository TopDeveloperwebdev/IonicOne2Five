import { Component, OnInit } from '@angular/core';
import { dataService } from '../../services/data.service';
import { ActionSheetController, NavController, ModalController, LoadingController } from '@ionic/angular';
import { FiltroComponent } from '../filtro/filtro.component';
@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {

  clientes = [];
  take = 100;
  skip = 0;
  clientesDataservice: any;
  usuario: any;
  constructor(private loadCtrl: LoadingController, private dataService: dataService, public actionSheetController: ActionSheetController, private navCtl: NavController, public modalController: ModalController) {
    this.usuario = JSON.parse(localStorage.getItem('user'));
  }

  async ngOnInit() {
    const loading = await this.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();
    this.pushClients(this.take, this.skip);
    loading.dismiss();

  }
  pushClients(take, skip) {
    this.dataService.getClients(this.usuario.vendedor_id, take, skip).subscribe(res => {
      for (let i = 0; i < res['length']; i++) {
        this.clientes.push(res[i]);
      }
      this.skip += this.take;
    });
  }
  loadMore($event) {
    return new Promise((resolve) => {
      this.pushClients(this.take, this.skip + this.take);
      $event.target.complete();
      resolve();
    })

  };


  async opcoes(cliente_id, razaosocial) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Pedidos',
        role: 'destructive',
        icon: 'list',
        handler: () => {
          this.navCtl.navigateForward('clientes/pedidos');
        }
      }, {
        text: 'Cadastro',
        icon: 'create',
        handler: () => {
          this.navCtl.navigateForward('clientes/cadastro');
        }
      }, {
        text: 'Títulos',
        icon: 'albums',
        handler: () => {
          this.navCtl.navigateForward('clientes/titulos');
        }
      }, {
        text: 'Motivos de Não Venda',
        icon: 'close-circle',
        handler: () => {
          console.log('Favorite clicked');
        }
      }]

    });
    await actionSheet.present();
  }
  cadastro() {
    this.navCtl.navigateForward('clientes/cadastro');
  }
  async filter() {
    const modal = await this.modalController.create({
      component: FiltroComponent,
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }


}