import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, AlertController } from '@ionic/angular';
import { DBService } from './../../../services/DB.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'
import { ConexaoService } from '../../../services/conexao.service';
import { dataService } from '../../../services/data.service';
import { initialConfig } from 'ngx-mask-ionic';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class naovendaListaComponent implements OnInit {
  cliente_id: any;
  db: any;

  nomecliente: any;
  listaVisitas: any;
  constructor(public navCtrl: NavController,
    public route: ActivatedRoute,
    public loadCtrl: LoadingController,
    public dbservice: DBService,
    public alertCtrl: AlertController,
    public conexaoService: ConexaoService,
    public DataService: dataService
  ) {
    this.db = dbservice;  
  }

async ionViewDidEnter(){
  console.log("ionViewDidEnter")
  const loading = await this.loadCtrl.create({
    message: 'Aguarde!'
  });
  loading.present();
  this.cliente_id = Number(this.route.snapshot.params['cliente_id']);
  this.listaVisitas = await this.db.visita_nao_venda.where('cliente_id').equals(this.cliente_id).toArray();
  loading.dismiss();
  this.nomecliente = this.route.snapshot.params['nomecliente'];
}
  async ngOnInit() {   
   
  }
  cadastroNaoVenda() {
    this.navCtrl.navigateForward(['clientes/naovendacadastro', { 'cliente_id': this.cliente_id, 'nomecliente': this.nomecliente }]);
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
  async duplicar(visita) {

    const loading = await this.loadCtrl.create({
      message: 'Duplicando visita. Aguarde!'
    });
    loading.present();
    var nova_visita_id = this.guid();
    var novaVisita;
    var id_visita;
    novaVisita = visita;
    delete novaVisita.visita_id;
    novaVisita.cod_visita_mob = nova_visita_id;
    novaVisita.enviado = 'N';
    this.db.visita_nao_venda.add(novaVisita).then(res => {
      loading.dismiss();
      this.confirmAlert();
    });
  }
  async confirmAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Mensagem',
      message: 'Visita duplicada com sucesso',
      buttons: [
        {
          text: 'OK',
          cssClass: 'button button-assertive',
          handler: (e) => {
            this.ionViewDidEnter();
          }
        }
      ]
    });
    await alert.present();
  }
  async apagar(visita) {
    const loading = await this.loadCtrl.create({
      message: 'Apagando visita. Aguarde!'
    });
    loading.present();
    if (isNaN(visita.visita_id)) {
      this.db.visita_nao_venda.where('cod_visita_mob').equals(visita.cod_visita_mob).delete().then((res) => {
        loading.dismiss();
        this.ionViewDidEnter();
      });
    } else {
      if (this.conexaoService.conexaoOnline()) {     
        this.DataService.excluir(visita.visita_id).subscribe(res => {
          console.log('res' , res);
          this.db.visita_nao_venda.where('cod_visita_mob').equals(visita.cod_visita_mob).delete().then((res) => {
            loading.dismiss();
            this.ionViewDidEnter();
          });
        }, error => {
          console.log('erro' , error);
          loading.dismiss();
          alert('Erro ao apagar visita no Web.');
        })
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Atenção!',
          message: 'Não é possivel remover esta visita sem estar conectado a internet.',
          buttons: [
            {
              text: 'OK',
              cssClass: 'button button-assertive',
            }
          ]
        });
        await alert.present();
      }
    }
  }
  alterar(visita) {
    this.navCtrl.navigateForward(['clientes/naovendacadastro', { 'visita': JSON.stringify(visita) }]);
  }
  backtopage(){
    this.navCtrl.navigateForward('clientes');
  }


}
