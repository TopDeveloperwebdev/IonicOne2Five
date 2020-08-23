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
  Copyfiltro : any;
  @Input() filtro: any;
  @Input() tabela_id: any;
  produtoEmPromocao : any;
  constructor(public modalController: ModalController, public dbService: DBService) {
    this.db = dbService;
    // this.filtro = {};
  }

  ngOnInit() {
    let self = this;

    this.db.tabela.toArray().then(function (tabelas) {
      self.tabelas = tabelas;
      console.log('tables', self.tabelas);
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
    this.Copyfiltro = {};
    Object.assign(this.Copyfiltro, this.filtro);
   
    if (!this.filtro.hasOwnProperty('tipopesquisa')) {
      this.tipoPesquisa = this.pesquisas[0].id;
    }
    else {
      this.tipoPesquisa = this.filtro.tipopesquisa;
    }
    if (!this.filtro.hasOwnProperty('inf_marca')) {
      this.marcaSelecionada = "";
    } else {
      this.marcaSelecionada = this.filtro.inf_marca;
    }
    if (!this.filtro.hasOwnProperty('produtoempromocao')) {
      this.produtoEmPromocao = false;
    } else {
      this.produtoEmPromocao = this.filtro.produtoempromocao;
    }

    if (!this.filtro.hasOwnProperty('inf_produto')) {
      this.tipoSelecionado = "";
    } else {
      this.tipoSelecionado = this.filtro.inf_produto;
    }
    if (!this.filtro.hasOwnProperty('descricaoproduto')) {
      this.descricaoproduto = "";
    } else {
      this.descricaoproduto = this.filtro.descricaoproduto;
    }

  }


  dismiss() {   
    this.modalController.dismiss({ filtro: this.Copyfiltro, tabela_id: this.tabela_id });
  }

  limparFiltro() {
    this.modalController.dismiss({ filtro: {}, tabela_id: this.tabela_id });
  }
  filtrarProdutos(descricaoproduto, marcaSelecionada, tipoSelecionado, produtoEmPromocao, tipoPesquisa) {
    if (marcaSelecionada != "") {
      this.filtro.inf_marca = marcaSelecionada;
    }
    else {
      delete this.filtro.inf_marca;
    }

    if (tipoSelecionado != "") {
      this.filtro.inf_produto = tipoSelecionado;
    }
    else {
      delete this.filtro.inf_produto;
    }

    if (produtoEmPromocao != false) {
      this.filtro.produtoempromocao = 'S';
    }
   else {
      delete this.filtro.produtoempromocao;
   }

    if (descricaoproduto != "") {
      this.filtro.descricaoproduto = descricaoproduto.toUpperCase();
    } else {
      delete this.filtro.descricaoproduto;
    }
    if (tipoPesquisa != "") {
      this.filtro.tipopesquisa = tipoPesquisa;
    } else {
      delete this.filtro.tipopesquisa;
    }

    this.modalController.dismiss({ filtro: this.filtro, tabela_id: this.tabela_id });

  }

  mudarTabelaPreco = function (tabela_id) {
    if (tabela_id != "")
      this.tabela_id = tabela_id;

  }

}