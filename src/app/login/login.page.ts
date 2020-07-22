import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController, AlertController, ModalController, MenuController, NavParams, IonInfiniteScroll } from '@ionic/angular';

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
  constructor(private AuthService: AuthService, public navCtrl: NavController, public alertCtrl: AlertController, private modalCtrl: ModalController, private menuCtrl: MenuController,) {
    this.hide = true;
  }
  ngOnInit() {
  }
  Login() {
    if (this.login != '' && this.Senha != '') {
      this.AuthService.login(this.login, this.Senha).subscribe(user => {
        if (user) {
          this.user = user;
          localStorage.setItem('user', JSON.stringify(this.user));
          console.log('user', this.user);
          this.navCtrl.navigateForward('/inicio')
        } else {
          localStorage.setItem('user', null);
        }
        error => {
          alert(error.message);
        }
      });
    }

  }

}
