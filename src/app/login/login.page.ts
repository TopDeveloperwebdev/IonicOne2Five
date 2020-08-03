import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController, Platform, AlertController, ModalController, MenuController, LoadingController, ToastController } from '@ionic/angular';
import { ConexaoService } from '../services/conexao.service';
import { DBService } from '../services/DB.service';
import { db } from '../services/DB.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login = "";
  Senha = "";
  user: any;
  hide: boolean;
  constructor(private AuthService: AuthService,
    private loadCtrl: LoadingController,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private menuCtrl: MenuController,
    public ConexaoService: ConexaoService,
    public toastController: ToastController,
    private platform: Platform,
    private DBService: DBService
  ) {
    this.hide = true;
  }

  ngOnInit() {
  }


  async presentToast(mensaje: any) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }


  //Login() {
  //   if (this.login != '' && this.Senha != '') {     
  //     this.AuthService.login(this.login, this.Senha).subscribe(user => {
  //       if (user['vendedor_id']) {
  //         this.user = user;
  //         db.setItem('user', JSON.stringify(this.user));
  //         console.log('user', this.user);
  //         this.navCtrl.navigateForward('/inicio')
  //       } else {        
  //         db.setItem('user', null);
  //       }
  //       error => {
  //         alert(error.message);
  //       }
  //     });
  //   }

  // }
  loginUsuario(login, senha) {

  }
  async Login() {
    const loading = await this.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();
    var login = this.login;
    var senha = this.Senha;

    let usuario = await db.usuario;
    debugger;
    if (usuario && usuario['vendedor_login'] === login) {

      if (this.ConexaoService.conexaoOnline()) {
        this.AuthService.verificaUsuarioBloqueado(usuario['vendedor_id']).subscribe(res => {
          if (res['data'].bloqueado === false) {
            if (usuario['vendedor_login'] === login && usuario['vendedor_senha'] === senha) {
              loading.dismiss();
              this.navCtrl.navigateForward('/inicio');
            } else {
              loading.dismiss();
              this.presentToast('Usuário ou senha incorretos.')
            }
          } else {

            alert("USUARIO BLOQUEADO, FAVOR ENTRAR EM CONTATO COM A EMPRESA");
            db.delete();
            db.usuario.clear();
            loading.dismiss();
            navigator['app'].exitApp();
          }
        }, (err) => {
          console.log(err);
          loading.dismiss();
          this.presentToast('Não foi possível conectar ao servidor. Tente novamente mais tarde.')
        });
      } else {
        this.presentToast('Verifique sua conexão.')
      }

    } else {
      this.AuthService.getUsuarioWeb(login.toLowerCase(), senha.toLowerCase()).subscribe(res => {

        if (res['vendedor_id'] === undefined) {
          loading.dismiss();
          this.presentToast('Usuário não encontrado.');
        } else {
          if (usuario['bloqueado'] === true) {
            alert("USUARIO BLOQUEADO, FAVOR ENTRAR EM CONTATO COM A EMPRESA");
            db.delete();

            db.usuario.clear();
            loading.dismiss();
            navigator['app'].exitApp();
          } else if (usuario['download_aplicativo'] === 'S') {
            loading.dismiss();
            this.presentToast('Você já fez o download em outro aparelho.');
          } else {
            db.usuario.add(res);
            localStorage.setItem('sincronizar', 'true');
            loading.dismiss();
            this.navCtrl.navigateForward('/inicio');
          }

        }

      },
        error => {
          loading.dismiss();
          db.usuario.clear();
          this.presentToast('Erro ao buscar usuário no WebService.');
        });
    }
  }

}
