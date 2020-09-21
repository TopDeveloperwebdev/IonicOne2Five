import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DBService } from '../../services/DB.service';
import { jsPDF } from "jspdf";
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  pedido: any;
  cliente_id: ''
  db: any
  itens: any
  constructor(
    public route: ActivatedRoute,
    public dbService: DBService,
  ) {
    this.db = dbService;
  }

  ngOnInit() {
    this.itens = [];
    this.pedido = JSON.parse(this.route.snapshot.params['pedido']);
    this.cliente_id = this.route.snapshot.params['cliente_id'];
    console.log('pedido', this.pedido);
    let pedido_id;
    if (isNaN(this.pedido.pedido_id)) {
      pedido_id = this.pedido.cod_pedido_mob;
    } else {
      pedido_id = this.pedido.pedido_id;
    }
    this.getItensPedido(pedido_id).then(res => {
      this.itens = res;
      console.log('this ', this.itens);
      setTimeout(() => {
        this.generatePdf();
       
      }, 1000); 
    });
  }

  generatePdf() {
    let HTML_Width, HTML_Height, PDF_Width, PDF_Height, canvas_image_width, canvas_image_height, top_left_margin;
    HTML_Width = document.getElementById('printable-area').clientWidth;
    HTML_Height = document.getElementById('printable-area').clientHeight;
    top_left_margin = 15;
    PDF_Width;
    PDF_Width = HTML_Width + (top_left_margin * 2);
    PDF_Height = (1.5 * PDF_Width) + (top_left_margin * 2);
    canvas_image_width = HTML_Width;
    canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
    const div = document.getElementById('printable-area');

    domtoimage.toPng(div).then((dataUrl) => {
      //Initialize JSPDF
      var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
      //Add image Url to PDF
      pdf.addImage(dataUrl, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
      console.log('totalPDFPages', PDF_Width, PDF_Height);
      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage();
        pdf.addImage(dataUrl, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
      }

      // pdf.save("HTML-Document.pdf");
      //let data = doc.save('pdfDocument.pdf');
    //  var binary = pdf.output();
     // return binary ? btoa(binary) : "";
       document.getElementById('printable-area').style.visibility='hidden';
      
    })

  }

  async getItensPedido(pedido_id) {
    const self = this;
    var itensArray = [];
    var produtosArray = [];
    return new Promise((resolve, reject) => {
      self.db.itempedido
        .where('pedido_id')
        .equals(pedido_id)
        .toArray()
        .then(
          itens => {

            if (itens.length) {
              itens.map((item, index) => {
                var i;
                i = item;
                return self.dbService.table('produto')
                  .where('produto_id')
                  .equals(i.codigo_produto)
                  .first().then(res => {
                    let prod;
                    prod = res;
                    i.descricao = prod && prod.descricaoproduto ?
                      prod.descricaoproduto :
                      "N/I";

                    itensArray.push(i);
                    if (index == itens.length - 1) {
                      return resolve(itensArray);
                    }
                  })
              });
            } else {
              return resolve(itensArray);
            }

          },
          err => {
            return reject(err);
          });
    });

  }
}
