import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { LoadingController, NavController } from '@ionic/angular';
import { DBService } from './../../../services/DB.service';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
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
  nomecliente : any;
  constructor(public geolocation: Geolocation,
    public loadCtrl: LoadingController,
    public dbService: DBService,
    public navCtrl: NavController,
    public route: ActivatedRoute,
    public datePipe: DatePipe) {
    this.db = dbService;
    this.form = {};
  }

  async ngOnInit() {

    this.motivosnaovenda = [];
    this.motivosnaovenda = await this.db.motivos_nao_venda.toArray();
    let usertemp = await this.dbService.table('usuario').toArray();
    this.usuario = usertemp[0];
      console.log('motivosnaovenda',this.motivosnaovenda);
    this.tipoVisita = [
      { nome: "Presencial" },
      { nome: "Celular" },
      { nome: "Email" },
      { nome: "Whatsapp" },
      { nome: "Outro" }
    ]
    let cliente_id = this.route.snapshot.params['cliente_id'];
    this.nomecliente=  this.route.snapshot.params['nomecliente'];
    if (cliente_id) {

      var id = this.guid();
      this.form = {
        data_visita: '',
        hora_visita: '',
        motivo_id: null,
        cod_visita_mob: id,
        cliente_id: Number(this.route.snapshot.params['cliente_id']),
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
   // var data = visita.data_visita.split('-');
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
      const loading = await self.loadCtrl.create({
        message: 'Aguarde!'
      });
      loading.present();

      var posOptions = {
        timeout: 5000,
        maximumAge: 3000,
        enableHighAccuracy: true
      };

      var visita;
      visita = self.form;
     
      visita.enviado = 'N';
      visita.data_visita = this.datePipe.transform(self.form.data_visita, "yyyy-MM-dd");
      visita.hora_visita = self.form.hora_visita;
      visita.data_gravacao = this.datePipe.transform(new Date(), "yyyy-MM-dd");
      visita.hora_gravacao = this.datePipe.transform(new Date(), "HH:mm:ss");
      console.log('visita',visita);
      self.geolocation.getCurrentPosition(posOptions).then((position) => {
        visita.latitude_gravacao = position.coords.latitude;
        visita.longitude_gravacao = position.coords.longitude;
        self.db.transaction("rw", self.db.visita_nao_venda, function () {         
          self.db.visita_nao_venda.put(visita);
        }).then(function () {
          self.navCtrl.navigateRoot(['clientes/naovendalist', { 'cliente_id': visita.cliente_id, 'nomecliente': self.nomecliente }]);
          loading.dismiss();
        }).catch((error) => {
        
          alert('Erro! Não foi possivel cadastrar/alterar a visita.');
          console.log(error);
          loading.dismiss();
        });
      }).catch(err => {

        console.log('err', err);
        visita.latitude_gravacao = 0;
        visita.longitude_gravacao = 0;
        alert("Localização não encontrada.");
        loading.dismiss();
        self.navCtrl.navigateForward(['clientes/naovendalist', { 'cliente_id': visita.cliente_id, 'nomecliente': self.nomecliente }]);
      })
    }
  }
}
