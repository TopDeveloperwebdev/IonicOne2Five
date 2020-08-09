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
  pesquisas = [{
    id: 1,
    descricao: 'Pesquisa Geral'
  },
  {
    id: 2,
    descricao: 'Pesquisa Início Descrição'
  }
  ];
  @Input() filtro: any;


  constructor(public modalController: ModalController, private dbService: DBService) { }

  async ngOnInit() {
    const tempatividade = await this.dbService.table('atividade').toArray();
    this.atividades = tempatividade[0];
    const tempcategorias = await this.dbService.table('categoria').toArray();
    this.categorias = tempcategorias[0];
    const tempresponsavel = await this.dbService.table('responsavel').toArray();
    this.responsaveis = tempresponsavel[0];
  }
  dismiss() {
    console.log('dismass');
    this.modalController.dismiss(this.filtro);
  }
 
  limparFiltro = function () { 
    this.filtro = {};    
    this.modalController.dismiss(this.filtro);
  }
}