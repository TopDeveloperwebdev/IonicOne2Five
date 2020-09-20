import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DBService } from '../../services/DB.service'
@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
})

export class FiltroComponent implements OnInit {
  atividades: any;
  categorias: any;
  responsaveis: any;
  categoria_id: any;
  responsavel_id: any;
  atividade_id: any;
  dia_visita: any;
  tipopesquisa: any;
  cli_razaosocial: any;
  apenasClientesAtraso: any;
  pesquisas = [{
    id: 1,
    descricao: 'Pesquisa Geral'
  },
  {
    id: 2,
    descricao: 'Pesquisa Início Descrição'
  }
  ];
  Copyfiltro : any;
  @Input() filtro: any;


  constructor(public modalController: ModalController, private dbService: DBService) { }

  async ngOnInit() {
    this.atividades = await this.dbService.table('atividade').toArray();
    this.categorias = await this.dbService.table('categoria').toArray();
    this.responsaveis = await this.dbService.table('responsavel').toArray();
    this.Copyfiltro = {};
    Object.assign(this.Copyfiltro, this.filtro);
    console.log('this.filtro' ,this.filtro);
    if (!this.filtro.hasOwnProperty('categoria_id')) {
      this.categoria_id = "";
    }
    else {
      this.categoria_id = this.filtro.categoria_id;
    }
   
    if (!this.filtro.hasOwnProperty('tipopesquisa')) {
      this.tipopesquisa = "1";
    } else {
      this.tipopesquisa = this.filtro.tipopesquisa;
    }
    if (!this.filtro.hasOwnProperty('cli_razaosocial')) {
      this.cli_razaosocial = "";
    } else {
      this.cli_razaosocial = this.filtro.cli_razaosocial;
    }
    if (!this.filtro.hasOwnProperty('cli_totaltitulosvencidos')) {
      this.apenasClientesAtraso = false;
    } else {
      this.apenasClientesAtraso = true;
    }
    if (!this.filtro.hasOwnProperty('responsavel_id')) {
      this.responsavel_id = "";
    } else {
      this.responsavel_id = this.filtro.responsavel_id;
    }
    if (!this.filtro.hasOwnProperty('atividade_id')) {
      this.atividade_id = "";
    } else {
      this.atividade_id = this.filtro.atividade_id;
    }
    if (!this.filtro.hasOwnProperty('dia_visita')) {
      this.dia_visita = "";
    } else {
      this.dia_visita = this.filtro.dia_visita;
    }

  }
  dismiss() {
    console.log('filtro' , this.Copyfiltro);
    this.modalController.dismiss(this.Copyfiltro);
  }

  limparFiltro = function () {
    this.filtro = {};
    this.modalController.dismiss(this.filtro);
  }
  Filtrar(tipopesquisa, cli_razaosocial, apenasClientesAtraso, categoria_id, responsavel_id, atividade_id, dia_visita) {
    console.log('categoria_id',categoria_id);
    if (tipopesquisa) {
      this.filtro.tipopesquisa = tipopesquisa;
    }
    this.filtro.cli_razaosocial = cli_razaosocial.toUpperCase();
    if (apenasClientesAtraso) {
      this.filtro.cli_totaltitulosvencidos = "0.00";
    }
    else {
      delete this.filtro.cli_totaltitulosvencidos;
    }

    if (categoria_id != "") {
   
      this.filtro.categoria_id = categoria_id;
    }
    else {
      delete this.filtro.categoria_id;
    }


    if (responsavel_id != "") {
      this.filtro.responsavel_id = Number(responsavel_id);
    } else {
      delete this.filtro.responsavel_id;
    }


    if (atividade_id != "") {
      this.filtro.atividade_id = Number(atividade_id);
    }
    else {
      delete this.filtro.atividade_id;
    }

    if (dia_visita != "") {
      this.filtro.dia_visita = dia_visita;
    }
    else {
      delete this.filtro.dia_visita;
    }
    this.modalController.dismiss(this.filtro);
  }
}
