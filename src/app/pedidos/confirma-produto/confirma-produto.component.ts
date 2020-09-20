import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { DBService } from '../../services/DB.service';
import { DetalhesProdutoComponent } from '../detalhes-produto/detalhes-produto.component';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
@Component({
  selector: 'app-confirma-produto',
  templateUrl: './confirma-produto.component.html',
  styleUrls: ['./confirma-produto.component.scss'],
})
export class ConfirmaProdutoComponent implements OnInit {

  db: any;
  usuario: any;
  comissoes_produto: any;
  itens: any;
  pedido: any;
  descontoPermitido : any;
  isValidate=true;
  @Input() produtoEscolhido: any;
  constructor(
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public dbService: DBService,
    public modalCtrl: ModalController) {
    this.db = dbService;

  }

  async ngOnInit() {
    let self = this;

    const loading = await this.loadCtrl.create({
      message: 'Aguarde!'
    });
    loading.present();

    let tempusuario = await this.db.table("usuario").toArray();
    self.usuario = tempusuario[0];
    var produto = self.produtoEscolhido;


    self.db.comissao
      .where("produto_id")
      .equals(produto.codigo_produto)
      .toArray()
      .then(function (res) {
        self.comissoes_produto = res;
        console.log('comissoes_produto',res);

        loading.dismiss();
      });
    var preco_unitario_comdesconto = parseFloat(
      self.produtoEscolhido.preco_unitario_comdesconto
    );
    var preco_unitario_bruto = parseFloat(
      self.produtoEscolhido.preco_unitario_bruto
    );
    if (preco_unitario_comdesconto > preco_unitario_bruto) {
      var diferenca = preco_unitario_comdesconto - preco_unitario_bruto;
      var porcentagem = (diferenca * 100) / preco_unitario_bruto;
      self.produtoEscolhido.acrescimo = porcentagem.toFixed(2);
    }
  }
  Minus() {
    if (this.produtoEscolhido.quantidade > 0) {
      this.produtoEscolhido.quantidade = this.produtoEscolhido.quantidade - 1;
      this.calculaPrecoPorQuantidade();
    }
  }
  Plus() {
    this.produtoEscolhido.quantidade = this.produtoEscolhido.quantidade + 1;
    this.calculaPrecoPorQuantidade();
  }
  dismiss(produto) {
    this.modalCtrl.dismiss(produto);
  }
  selecionaComissao() {
    let self = this;
    var preco_tabela = parseFloat(
      self.produtoEscolhido.preco_unitario_bruto
    );
    let valor_comicao
    valor_comicao = parseFloat(self.produtoEscolhido.comissao);

    var difenca_preco = preco_tabela - valor_comicao;
    var desconto_calculado = (difenca_preco * 100) / preco_tabela;

    self.produtoEscolhido.desc_unitario_percentual = desconto_calculado.toFixed(2
    );
    self.produtoEscolhido.preco_unitario_comdesconto = valor_comicao.toFixed(
      2
    );

    var quantidade = parseFloat(self.produtoEscolhido.quantidade);
    var valor_total = valor_comicao.toFixed(2) * quantidade;
    self.produtoEscolhido.valor_total_item = valor_total.toFixed(2);
    self.produtoEscolhido.acrescimo = 0.0;
  };
  toNumber(string) {
    var number = string.replace(/([.])/g, "");
    return number.replace(",", ".");
  }

  async maisDetalhesProduto() {
    const modal = await this.modalCtrl.create({
      component: DetalhesProdutoComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'produtoEscolhido': this.produtoEscolhido,
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        if(data['data']){
          let producto = data['data'];
        }        
      });
    return await modal.present();
  }
  confirmaProdutoPedido(form: NgForm) {
    if (form.valid) {

      this.dismiss(this.produtoEscolhido)
    }
  };
  calculaDesconto(form: NgForm) {

    var desconto = parseFloat(
      this.produtoEscolhido.desc_unitario_percentual
    );
    var desc_permitido = parseFloat(
      this.produtoEscolhido.desc_maximopercentual
    );
    var quantidade = this.produtoEscolhido.quantidade;

    this.produtoEscolhido.acrescimo = 0;

    if (desconto > desc_permitido) {
      // alert('O DESCONTO NÃO PODE SER MAIOR DO QUE ' + desc_permitido + ' %.');
       this.descontoPermitido = desc_permitido;
     
       this.isValidate= false;
       
    } else {
      this.isValidate= true;
      var preco_tabela = parseFloat(
        this.produtoEscolhido.preco_unitario_bruto
      );
      var valor_comicao = parseFloat(this.produtoEscolhido.comissao);

      var preco_definido = isNaN(valor_comicao) ?
        preco_tabela :
        valor_comicao;
      var preco_desconto = preco_definido - (preco_definido * desconto) / 100;
      var preco_total = quantidade * preco_desconto;

      this.produtoEscolhido.preco_unitario_comdesconto = preco_desconto.toFixed(
        2
      );
      this.produtoEscolhido.valor_total_item = preco_total.toFixed(2);
    }
  }
  calculaPrecoComDesconto(form: NgForm) {
    var desc_permitido = parseFloat(
      this.produtoEscolhido.desc_maximopercentual
    );

    var preco_unitario_comdesconto = parseFloat(
      this.produtoEscolhido.preco_unitario_comdesconto
    );
    var preco_unitario_bruto = parseFloat(
      this.produtoEscolhido.preco_unitario_bruto
    );
    var quantidade = parseFloat(this.produtoEscolhido.quantidade);
    if (preco_unitario_comdesconto > preco_unitario_bruto) {
      var diferenca = preco_unitario_comdesconto - preco_unitario_bruto;
      var porcentagem = (diferenca * 100) / preco_unitario_bruto;
      this.produtoEscolhido.acrescimo = porcentagem.toFixed(2);
      this.produtoEscolhido.desc_unitario_percentual = 0.0; //
    } else if (preco_unitario_comdesconto < preco_unitario_bruto) {
      var diferenca = preco_unitario_bruto - preco_unitario_comdesconto;
      var porcentagem = (diferenca * 100) / preco_unitario_bruto;
      this.produtoEscolhido.desc_unitario_percentual = porcentagem.toFixed(
        2
      ); //
      this.produtoEscolhido.acrescimo = 0.0;
    } else {
      this.produtoEscolhido.acrescimo = 0.0;
      this.produtoEscolhido.desc_unitario_percentual = 0.0; //
    }
  
    if (this.produtoEscolhido.desc_unitario_percentual > desc_permitido) {
      // alert('O DESCONTO NÃO PODE SER MAIOR DO QUE ' + desc_permitido + ' %.');
     
      this.isValidate= false;
  } else {

      this.isValidate= true;
  }

    var valor_total = preco_unitario_comdesconto * quantidade;
    this.produtoEscolhido.valor_total_item = valor_total.toFixed(2);
  }

  calculaPrecoPorQuantidade() {
    try {
      var preco_unitario_comdesconto = parseFloat(
        this.produtoEscolhido.preco_unitario_comdesconto
      );
      var quantidade = parseFloat(this.produtoEscolhido.quantidade);
      var valor_total = preco_unitario_comdesconto * quantidade;
      this.produtoEscolhido.valor_total_item = valor_total.toFixed(2);
    } catch (e) {

    }
  }
  atualizarPreco(form: NgForm) {

    if (this.produtoEscolhido.quantidade > 0) {
      var acrescimo = parseFloat(this.produtoEscolhido.acrescimo);

      this.produtoEscolhido.desc_unitario_percentual = 0;
      //desconto = 0;

      var preco_tabela = parseFloat(
        this.produtoEscolhido.preco_unitario_bruto
      );
      var valor_comicao = parseFloat(this.produtoEscolhido.comissao);

      var preco_definido = isNaN(valor_comicao) ?
        preco_tabela :
        valor_comicao;
      var preco_acrescimo =
        preco_definido + (preco_definido * acrescimo) / 100;

      var difenca_preco = preco_tabela - preco_definido;
      var desconto_calculado = (difenca_preco * 100) / preco_tabela;

      var quantidade = parseFloat(this.produtoEscolhido.quantidade);

      var valor_total = preco_acrescimo * quantidade;

      this.produtoEscolhido.desc_unitario_percentual = desconto_calculado.toFixed(
        2
      );
      this.produtoEscolhido.preco_unitario_comdesconto = preco_acrescimo.toFixed(
        2
      );

      this.produtoEscolhido.valor_total_item = valor_total.toFixed(2);
    }
  }



}
