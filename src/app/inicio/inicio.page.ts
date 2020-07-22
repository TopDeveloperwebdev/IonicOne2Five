import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, MenuController, ToastController, AlertController, LoadingController, ActionSheetController } from "@ionic/angular";
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  usuario: {};
  constructor(private loadCtrl: LoadingController, private navCtl: NavController, public actionSheetController: ActionSheetController) {


  }

  async ngOnInit() {
    const loading = await this.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();
    this.usuario = localStorage.getItem('user');
    console.log('usera', this.usuario);
    loading.dismiss();
  }
  navigate(pagename) {
    console.log('pagename', pagename);
    this.navCtl.navigateForward(pagename);
  }
  async opcoesRelatorios(cliente_id, razaosocial) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opções de Relatório',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Títulos',
        role: 'destructive',
        icon: 'ion-android-list',
        handler: () => {
          this.navCtl.navigateForward('titulos/lista');
        }
      }, {
        text: 'Compras',
        icon: 'edit',
        handler: () => {
          this.navCtl.navigateForward('clientes/cadastro');
        }
      }, {
        text: 'Compras - Por item',
        icon: 'filing',
        handler: () => {
          this.navCtl.navigateForward('clientes/titulos');
        }
      }]

    });
    await actionSheet.present();
  }

}
