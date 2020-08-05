import { Component, OnInit } from '@angular/core';
import { Platform, ModalController, NavController, MenuController, ToastController, AlertController, LoadingController, ActionSheetController } from "@ionic/angular";
import { DBService } from '../services/DB.service';
import { ConexaoService } from '../services/conexao.service';
import { dataService } from '../services/data.service'
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  usuario: any;
  userTable: Dexie.Table<any, number>;
  // loading: any;
  constructor(
    private loadCtrl: LoadingController,
    private navCtl: NavController,
    public actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private toastController: ToastController,
    private platform: Platform,
    private dbService: DBService,
    private conexaoService: ConexaoService,
    private dataService: dataService) {

  }
  async presentToast(mensaje: any) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }
  async ngOnInit() {
    this.userTable = this.dbService.table('usuario');
    this.usuario = await this.userTable.toArray();
    if (this.usuario.length == 0) {
      this.navCtl.navigateForward('login');
    }
    this.usuario = this.usuario[0];
    if (localStorage.getItem('sincronizar') == 'true') {
      if (this.conexaoService.conexaoOnline()) {

        const loading = await this.loadCtrl.create({
          message: 'Sincronizando, aguarde!'
        });
        loading.present();
        this.dataService.init(this.usuario['vendedor_id']);

      } else {
        this.presentToast('Não há conexão com a internet no momento.')
      }
    }
  }
  navigate(pagename) {
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


// if (store.get('sincronizar') == true) {
//   if (ConexaoService.conexaoOnline()) {
//     $ionicLoading.show({
//       template: 'Sincronizando, aguarde!'
//     });

//     SincronizacaoService.init();

//   } else {
//     $cordovaToast.showShortBottom('Não há conexão com a internet no momento.');
//   }
// }




// $scope.sair = function () {
//   $ionicPopup.confirm({
//     title: 'Sair do aplicativo',
//     template: 'DESEJA SAIR DO APLICATIVO?',
//     buttons: [
//       {text: 'Não'},
//       {
//         text: 'Sim',
//         type: 'button-assertive',
//         onTap: function () {
//           //  store.remove('usuario');
//           //  window.cache.clear();
//           ionic.Platform.exitApp();
//         }
//       }
//     ]
//   });
// }