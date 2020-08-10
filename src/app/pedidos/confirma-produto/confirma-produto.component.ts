import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { DBService } from '../../services/DB.service';
import { DetalhesProdutoComponent } from '../detalhes-produto/detalhes-produto.component'
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

    self.produtoEscolhido.desc_unitario_percentual = desconto_calculado.toFixed(
      2
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
        let producto = data['data'];
      });
    return await modal.present();
  }
  confirmaProdutoPedido(produto) {
    this.dismiss(produto)
  };


}
