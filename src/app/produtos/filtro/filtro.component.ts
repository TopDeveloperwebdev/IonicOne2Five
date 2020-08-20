import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DBService } from '../../services/DB.service'
@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
})
export class FiltroComponent implements OnInit {
  db: any;
  tipoPesquisa: any;
  tabelas: any;
  pesquisas: any;
  tiposProduto: any;
  marcas: any;
  descricaoproduto = "";
  marcaSelecionada: any;
  tipoSelecionado: any;

  @Input() filtro: any;
  @Input() tabela_id: any;
  produtoEmPromocao = "";
  constructor(public modalController: ModalController, public dbService: DBService) {
    this.db = dbService;
    // this.filtro = {};
  }

  ngOnInit() {
    let self = this;

    this.db.tabela.toArray().then(function (tabelas) {
      self.tabelas = tabelas;
      console.log('tables' , self.tabelas);
    });
    self.db.marcas_produto.toArray().then(function (res) {
      self.marcas = res;
    });

    self.db.tipos_produto.toArray().then(function (res) {
      self.tiposProduto = res;
    });
    self.pesquisas = [
      {

        id: 1,
        descricao: 'Pesquisa Geral'
      },
      {
        id: 2,
        descricao: 'Pesquisa Início Descrição'
      }
    ];

    self.tipoPesquisa = this.pesquisas[0].id;
    if (!this.filtro.hasOwnProperty('tipoPesquisa')) {
      this.tipoPesquisa = "";
    }
    else {
      this.tipoPesquisa = this.filtro.tipoPesquisa;
    }
    if (!this.filtro.hasOwnProperty('marcaSelecionada')) {
      this.marcaSelecionada = "";
    } else {
      this.marcaSelecionada = this.filtro.inf_marca;
    }
    if (!this.filtro.hasOwnProperty('produtoEmPromocao')) {
      this.produtoEmPromocao = "";
    } else {
      this.marcaSelecionada = this.filtro.produtoEmPromocao;
    }

    if (!this.filtro.hasOwnProperty('tipoSelecionado')) {
      this.tipoSelecionado = "";
    } else {
      this.marcaSelecionada = this.filtro.inf_produto;
    }
    if (!this.filtro.hasOwnProperty('descricaoproduto')) {
      this.descricaoproduto = "";
    } else {
      this.descricaoproduto = this.filtro.descricaoproduto;
    }

  }


  dismiss(filtro) {
    console.log('dismass');
    this.modalController.dismiss({ filtro: this.filtro, tabela_id: this.tabela_id });
  }

  limparFiltro() {
    this.modalController.dismiss(this.filtro);
  }
  filtrarProdutos(descricaoproduto, marcaSelecionada, tipoSelecionado, produtoEmPromocao, tipoPesquisa) {  
    if (marcaSelecionada != "") {
      this.filtro.inf_marca = marcaSelecionada;
    }

    if (tipoSelecionado != "") {
      this.filtro.inf_produto = tipoSelecionado;
    }

    if (typeof produtoEmPromocao != 'undefined' && produtoEmPromocao != false) {
      this.filtro.produtoEmPromocao = 'S';
    }

    if (descricaoproduto != "") {
      this.filtro.descricaoproduto = descricaoproduto.toUpperCase();
    }
    if (tipoPesquisa != "") {
      this.filtro.tipoPesquisa = tipoPesquisa;
    }
    
    this.modalController.dismiss({ filtro: this.filtro, tabela_id: this.tabela_id });

  }

  mudarTabelaPreco = function (tabela_id) {
    if (tabela_id != "")
      this.tabela_id = tabela_id;

  }

}