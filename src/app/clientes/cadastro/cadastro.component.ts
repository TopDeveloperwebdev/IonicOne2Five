import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { DBService } from '../../services/DB.service';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent implements OnInit {

  atividades: any;
  categorias: any;
  responsaveis: any;
  cidades: any;
  pesquisas = [{
    id: 1,
    descricao: 'Pesquisa Geral'
  },
  {
    id: 2,
    descricao: 'Pesquisa Início Descrição'
  }
  ];
  cliente: any;
  db: any;
  cliente_id: any;


  constructor(public alertCtrl: AlertController, public modalController: ModalController, private dbService: DBService, public navCtrl: NavController, public loadCtrl: LoadingController, private formBuilder: FormBuilder, public route: ActivatedRoute) {
    this.db = dbService;
    this.cliente = { cli_id: null, atividade_id: '', cli_codigocidadeentrega: '' };
  }

  async ngOnInit() {
    this.atividades = await this.dbService.table('atividade').toArray();
    this.cidades = await this.dbService.table('cidade').toArray();

    this.cliente_id = this.route.snapshot.params['cliente_id'];

    if (this.cliente_id) {
      this.db.clientes.where('cli_id').equals(Number(this.cliente_id)).first().then(cliente => {
        this.cliente = cliente;
        console.log('this.cliente' , this.cliente);
      });
    }
  }

  async salvar(form: NgForm) {
    if (form.valid) {

      const loading = await this.loadCtrl.create({
        message: 'Aguarde!'
      });
      loading.present();
      let usertemp = await this.dbService.table('usuario').toArray();
      let usuario = usertemp[0];


      this.cliente.vendedor_id = usuario.vendedor_id;
      this.cliente.enviado = 'N';
      this.cliente.cli_pessoafj = this.cliente.cli_cnpjcpf.length <= 11 ? 'F' : 'J';
      this.cliente.cli_razaosocial = this.cliente.cli_razaosocial.toUpperCase();
      this.cliente.cli_codigocidadeentrega = null;

      this.cliente.cli_fantasia = this.cliente.cli_fantasia.toUpperCase();

      if (typeof this.cliente.cli_inscricaoestadual === "undefined") {
        this.cliente.cli_inscricaoestadual = "";
      }

      if (typeof this.cliente.cli_inscricaomunicipal === "undefined") {
        this.cliente.cli_inscricaomunicipal = "";
      }

      this.cliente.cli_endereco = this.cliente.cli_endereco.toUpperCase();

      this.cliente.cli_bairro = this.cliente.cli_bairro.toUpperCase();

      if (typeof this.cliente.cli_fax === "undefined") {
        this.cliente.cli_fax = "";
      }

      if (typeof this.cliente.cli_email === "undefined") {
        this.cliente.cli_email = "";
      } else {
        this.cliente.cli_email = this.cliente.cli_email.toUpperCase();
      }

      this.cliente.cli_contato1 = this.cliente.cli_contato1.toUpperCase();

      if (typeof this.cliente.cli_contato2 === "undefined") {
        this.cliente.cli_contato2 = "";
      } else {
        this.cliente.cli_contato2 = this.cliente.cli_contato2.toUpperCase();
      }

      if (typeof this.cliente.cli_telefone2 === "undefined") {
        this.cliente.cli_telefone2 = "";
      }

      if (typeof this.cliente.cli_enderecoentrega === "undefined") {
        this.cliente.cli_enderecoentrega = "";
      } else {
        this.cliente.cli_enderecoentrega = this.cliente.cli_enderecoentrega.toUpperCase();
      }

      if (typeof this.cliente.cli_bairroentrega === "undefined") {
        this.cliente.cli_bairroentrega = "";
      } else {
        this.cliente.cli_bairroentrega = this.cliente.cli_bairroentrega.toUpperCase();
      }

      if (typeof this.cliente.cli_cepentrega === "undefined") {
        this.cliente.cli_cepentrega = "";
      }


      if (this.cliente.cli_id == null) {
        this.cliente.cli_id = parseInt(this.cliente.cli_cnpjcpf);

        this.db.clientes.add(this.cliente);
      } else {
        this.db.clientes.put(this.cliente);
      }

      loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Mensagem',
        message: 'Cliente Salvo com sucesso!',
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            cssClass: 'button button-assertive',
            handler: () => {
              this.navCtrl.navigateForward('clientes/lista');
            }
          }
        ]
      });
      await alert.present();

    }

  }
}
