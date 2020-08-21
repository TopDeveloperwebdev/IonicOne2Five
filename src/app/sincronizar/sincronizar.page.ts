import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { DBService } from '../services/DB.service';
import { ConexaoService } from '../services/conexao.service'
import { dataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-sincronizar',
  templateUrl: './sincronizar.page.html',
  styleUrls: ['./sincronizar.page.scss'],
})
export class SincronizarPage implements OnInit {
  usuario: any;
  constructor(
    public conexaoService: ConexaoService,
    public loadCtrl: LoadingController,
    public dataService: dataService,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public dbService: DBService,
    public toastController: ToastController,
    public auth: AuthService) { }

  async ngOnInit() {
    const loading = await this.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();
    this.sincronizar().then(res => {
      loading.dismiss();
    });
  }
  async sincronizar() {
    let self = this;
    let usertemp = await this.dbService.table('usuario').toArray();
    self.usuario = usertemp[0];
    if (this.conexaoService.conexaoOnline()) {

      this.dataService.sincronismo(this.usuario.vendedor_id).subscribe(res => {
        console.log('res', res);
        if (res['sincronizar'] == true) {
          //-

        } else {
          this.successConfirm();
        }
      });
    } else {
      this.failConfirm();
    }
  }

  async successConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Mensagem',
      message: 'Desculpe, mas você não tem permissão para sincronizar seu aparelho neste horário. Favor entrar em contato com a empresa.',
      buttons: [
        {
          text: 'OK',
          cssClass: 'button button-assertive',
          handler: (e) => {
            this.navCtrl.navigateForward('inicio')
          }
        }
      ]
    });
    await alert.present();
  }
  async failConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Mensagem',
      message: 'Você não tem conexão com a internet no momento. tentar novamente?',
      buttons: [

        {
          text: 'Sim',
          cssClass: 'button button-assertive',
          handler: (e) => {
          }
        },
        {
          text: 'Não',
          handler: (e) => {
            this.navCtrl.navigateForward('inicio')
          }
        }
      ]
    });
    await alert.present();
  }
  async sincronizarSaidaAlert(num_pedidos, num_clientes, num_visitas) {
    const alert = await this.alertCtrl.create({
      header: 'Mensagem',
      message: 'ENVIADO PARA O SERVIDOR:<br>' + num_pedidos + ' PEDIDOS, <br>' + num_clientes + ' CLIENTES e<br> ' + num_visitas + ' VISITAS',
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel',
          cssClass: 'button button-assertive',

        },
      ]
    });
    await alert.present();
  }
  async sincronizarUsuarioAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Mensagem',
      message: 'INFORMAÇÕES DO USUÁRIO ATUALIZADAS!',
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel',
          cssClass: 'button button-assertive',

        },
      ]
    });
    await alert.present();
  }
  async sincronizarAlert(message) {
    const alert = await this.alertCtrl.create({
      header: 'Mensagem',
      message: message,
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel',
          cssClass: 'button button-assertive',

        },
      ]
    });
    await alert.present();
  }
  async presentToast(mensaje: any) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }
  async sincronizarEntrada() {
    console.log("SINCRONISMO", "sincronizarEntrada");

    if (this.conexaoService.conexaoOnline()) {
      const loading = await this.loadCtrl.create({
        message: 'Sincronizando entradas, aguarde!'
      });
      loading.present();
      this.dataService.init(this.usuario.vendedor_id);      
    } else {
      this.presentToast('Não há conexão com a internet no momento.');
    }

  };

  async sincronizarSaida() {
    console.log("SINCRONISMO", "sincronizarSaida");
    let num_pedidos;
    let num_clientes;
    let num_visitas;

    if (this.conexaoService.conexaoOnline()) {
      const loading = await this.loadCtrl.create({
        message: 'Sincronizando saídas, aguarde!'
      });
      loading.present();
      this.dataService.sincronizarSaida().subscribe(res => {
        num_pedidos = res[0];
        num_clientes = res[1];
        num_visitas = res[2];
        loading.dismiss();
        this.sincronizarSaidaAlert(num_pedidos, num_clientes, num_visitas);
      }, (error) => {
        console.log('erro' , error);
        this.presentToast('PROBLEMAS NO SINCRONISMO DE SAÍDA.');
        loading.dismiss();
      });
    }
  }

  async sincronizarUsuario() {
    let self = this;
    if (this.conexaoService.conexaoOnline()) {
      const loading = await this.loadCtrl.create({
        message: 'Sincronizando dados do vendedor, aguarde!'
      });
      loading.present();

      this.auth.getUsuarioWeb(self.usuario.vendedor_login, self.usuario.vendedor_senha).subscribe(res => {

        this.dbService.table('usuario').clear();
        this.dbService.table('usuario').add(res);
        this.dbService.table('usuario').toArray().then(res => {
          self.usuario = res[0];
        });
        this.sincronizarUsuarioAlert();
        loading.dismiss();
      }, err => {
        this.presentToast(err);
      })
    }
    else {
      this.presentToast('Não há conexão com a internet no momento.');
    }
  }

  async sincronizarClientes() {
    console.log("SINCRONISMO", "sincronizarClientes");

    if (this.conexaoService.conexaoOnline()) {

      const loading = await this.loadCtrl.create({
        message: 'Sincronizando clientes, aguarde!'
      });
      loading.present();
      this.dataService.sincronizarClientes(this.usuario.vendedor_id);
    } else {
      this.presentToast('Não há conexão com a internet no momento.');
    }

  }
  async sincronizarCompras() {

    if (this.conexaoService.conexaoOnline()) {

      const loading = await this.loadCtrl.create({
        message: 'Sincronizando compras, aguarde!'
      });
      loading.present();
      this.dataService.sincronizarCompras(this.usuario.vendedor_id);
    } else {
      this.presentToast('Não há conexão com a internet no momento.');
    }

  }
  async sincronizarProdutos() {

    if (this.conexaoService.conexaoOnline()) {

      const loading = await this.loadCtrl.create({
        message: 'Sincronizando produtos, aguarde!'
      });
      loading.present();
      this.dataService.sincronizarProdutos(this.usuario.vendedor_id);
    } else {
      this.presentToast('Não há conexão com a internet no momento.');
    }

  }
  async sincronizarTitulos() {

    if (this.conexaoService.conexaoOnline()) {

      const loading = await this.loadCtrl.create({
        message: 'Sincronizando títulos, aguarde!'
      });
      loading.present();
      this.dataService.sincronizarTitulos(this.usuario.vendedor_id);
    } else {
      this.presentToast('Não há conexão com a internet no momento.');
    }

  }

}
