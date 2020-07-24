import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, MenuController, ToastController, AlertController, LoadingController, ActionSheetController } from "@ionic/angular";
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  
  usuario  = {
    vendedor_nome : ''
  }
  constructor(private loadCtrl: LoadingController, private navCtl: NavController, public actionSheetController: ActionSheetController) {     
      
  }

  async ngOnInit() {
    const loading = await this.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();
    this.usuario = JSON.parse(localStorage.getItem('user'));   
 
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
        icon: 'list',
        handler: () => {
          this.navCtl.navigateForward('titulos/lista');
        }
      }, {
        text: 'Compras',
        icon: 'list',
        handler: () => {
          this.navCtl.navigateForward('clientes/cadastro');
        }
      }, {
        text: 'Compras - Por item',
        icon: 'list',
        handler: () => {
          this.navCtl.navigateForward('clientes/titulos');
        }
      }]

    });
    await actionSheet.present();
  }

}
