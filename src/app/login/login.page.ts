import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController, Platform, AlertController, ModalController, MenuController, LoadingController, ToastController } from '@ionic/angular';
import { ConexaoService } from '../services/conexao.service';
import { DBService } from '../services/DB.service';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

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
  userTable: Dexie.Table<any, number>;
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
    this.login = localStorage.getItem("login");
    this.Senha = localStorage.getItem("Senha");
  }


  async presentToast(mensaje: any) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }
  async Login(form: NgForm) {
    const loading = await this.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();
    localStorage.setItem("login", this.login);
    localStorage.setItem("Senha", this.Senha);
    var login = this.login;
    var senha = this.Senha;

    this.userTable = this.DBService.table('usuario');
    let usuario = await this.userTable.toArray();
    usuario = usuario[0];

    if (usuario && usuario['vendedor_login'] === login) {

      if (this.ConexaoService.conexaoOnline()) {
        this.AuthService.verificaUsuarioBloqueado(usuario['vendedor_id']).subscribe(res => {
          if (res['bloqueado'] === false) {
            if (usuario['vendedor_login'] === login && usuario['vendedor_senha'] === senha) {
              loading.dismiss();
              this.navCtrl.navigateForward('/inicio');
            } else {
              loading.dismiss();
              this.presentToast('Usuário ou senha incorretos.')
            }
          } else {

            alert("USUARIO BLOQUEADO, FAVOR ENTRAR EM CONTATO COM A EMPRESA");
            this.userTable.clear();
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
          if (res['bloqueado'] === true) {
            alert("USUARIO BLOQUEADO, FAVOR ENTRAR EM CONTATO COM A EMPRESA");
            this.userTable.clear();
            loading.dismiss();
            navigator['app'].exitApp();
          }
          // else if (res['download_aplicativo'] === 'S') {
          //   loading.dismiss();
          //   this.presentToast('Você já fez o download em outro aparelho.');
          // }
          else {
            this.userTable.add(res);
            localStorage.setItem('sincronizar', 'true');
            loading.dismiss();
            this.navCtrl.navigateForward('/inicio');
          }

        }

      },
        error => {
          loading.dismiss();
          this.userTable.clear();
          this.presentToast('Erro ao buscar usuário no WebService.');
        });
    }
  }


}
