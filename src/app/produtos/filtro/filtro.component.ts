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
  tabela_id: any;
  tiposProduto: any;
  marcas: any;
  descricaoproduto = '';
  marcaSelecionada: any;
  tipoSelecionado: any;
  filtro: any;
  produtoEmPromocao = '';
  constructor(public modalController: ModalController, public dbService: DBService) {
    this.db = dbService;
    this.filtro = {};
  }

  ngOnInit() {
    let self = this;
    
    this.db.tabela.toArray().then(function (tabelas) {
      self.tabelas = tabelas;
      self.tabela_id = tabelas.tabela_id;
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
  }


  dismiss(filtro) {
    console.log('dismass');
    this.modalController.dismiss(filtro);
  }

  limparFiltro() {
    this.modalController.dismiss(this.filtro);
  }
  filtrarProdutos(descricaoproduto, marcaSelecionada, tipoSelecionado, produtoEmPromocao, tipoPesquisa) {
    console.log('ffffffff', this.filtro);
  

    if (marcaSelecionada != null) {
      this.filtro.inf_marca = marcaSelecionada;
    }

    if (tipoSelecionado != null) {
      this.filtro.inf_produto = tipoSelecionado;
    }

    if (typeof produtoEmPromocao != 'undefined' && produtoEmPromocao != false) {
      this.filtro.produtoEmPromocao = 'S';
    }

    if (descricaoproduto != '' && descricaoproduto != null) {
      this.filtro.descricaoproduto = descricaoproduto.toUpperCase();
    }

    this.filtro.tipoPesquisa = tipoPesquisa;    
    this.dismiss(this.filtro);

  }

  mudarTabelaPreco = function (tabela_id) {
    this.tabela_id = tabela_id;

  }

}