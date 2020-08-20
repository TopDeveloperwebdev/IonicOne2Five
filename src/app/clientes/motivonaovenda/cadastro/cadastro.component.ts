import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { LoadingController, NavController } from '@ionic/angular';
import { DBService } from './../../../services/DB.service';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class MotiCadastroComponent implements OnInit {

  db: any;
  form: any;
  motivosnaovenda: any;
  tipoVisita: any;
  usuario: any;
  constructor(public geolocation: Geolocation,
    public loadCtrl: LoadingController,
    public dbService: DBService,
    public navCtrl: NavController,
    public route: ActivatedRoute) {
    this.db = dbService;
    this.form = {};
  }

  async ngOnInit() {

    this.motivosnaovenda = [];
    this.motivosnaovenda = await this.db.motivos_nao_venda.toArray();
    let usertemp = await this.dbService.table('usuario').toArray();
    this.usuario = usertemp[0];

    this.tipoVisita = [
      { nome: "Presencial" },
      { nome: "Celular" },
      { nome: "Email" },
      { nome: "Whatsapp" },
      { nome: "Outro" }
    ]
    let cliente_id = this.route.snapshot.params['cliente_id'];
    if (cliente_id) {

      var id = this.guid();
      this.form = {
        data_visita: '',
        hora_visita: '',
        motivo_id: null,
        cod_visita_mob: id,
        cliente_id: this.route.snapshot.params['cliente_id'],
        nomecliente: this.route.snapshot.params['nomecliente'],
        tipo_visita: "Presencial",
        vendedor_id: this.usuario.vendedor_id
      };
    }
    else {
      let visita = JSON.parse(this.route.snapshot.params['visita']);
      this.alter(visita);
    }

  }
  alter(visita) {
    var pedido_id;
    var visita;
    visita = visita;
    var data = visita.data_visita.split('-');
    // visita.data_visita = new Date(data[0], data[1] - 1, data[2]);
    visita.data_visita = visita.data_visita
    delete visita.$$hashKey;
    this.form = visita;

  }
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
  async salvar(ngform: NgForm) {
    let self = this;
    if (ngform.valid) {
      const loading = await this.loadCtrl.create({
        message: 'Aguarde!'
      });
      loading.present();

      var posOptions = {
        timeout: 5000,
        maximumAge: 3000,
        enableHighAccuracy: true
      };

      var visita;
      visita = this.form;
      visita.enviado = 'N';
      visita.data_visita = this.form.data_visita;
      visita.hora_visita = this.form.hora_visita;
      visita.data_gravacao = new Date();
      visita.hora_gravacao = new Date();


      this.geolocation.getCurrentPosition().then(position => {
        visita.latitude_gravacao = position.coords.latitude;
        visita.longitude_gravacao = position.coords.longitude;
        this.db.transaction("rw", this.db.visita_nao_venda, function () {
          this.db.visita_nao_venda.put(visita);
        }).then(function () {
          self.navCtrl.navigateRoot(['clientes/naovendalist', { 'cliente_id': visita.cliente_id, 'nomecliente': visita.nomecliente }]);
          loading.dismiss();
        }).catch(function (error) {
          loading.dismiss();
          alert('Erro! Não foi possivel cadastrar/alterar a visita.');
          console.log(error);
        });
      }, err => {
        visita.latitude_gravacao = 0;
        visita.longitude_gravacao = 0;
        alert("Localização não encontrada.");
        this.navCtrl.navigateForward(['clientes/naovendalist', { 'cliente_id': visita.cliente_id, 'nomecliente': visita.nomecliente }]);
      })
    }
  }
}
