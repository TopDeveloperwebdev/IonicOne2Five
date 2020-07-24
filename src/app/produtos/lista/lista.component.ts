import { Component, OnInit } from '@angular/core';
import { dataService } from '../../services/data.service';
import { ModalController } from '@ionic/angular';
import { DetalhesComponent } from '../detalhes/detalhes.component';
import { FiltroComponent } from '../filtro/filtro.component'
@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {

  page_limit = 50;
  increaseItems = 50;
  usuario: any;
  produtosDataservice: any;
  comissoes: any;
  marcas: any;
  produtos: any;
  tabelas: any;
  tipos: any;
  constructor(private dataService: dataService, public modalController: ModalController) {
    this.usuario = JSON.parse(localStorage.getItem('user'));
  }
  ngOnInit() {
    this.dataService.getProdutos(this.usuario.vendedor_id).subscribe(res => {
      this.produtosDataservice = res['produtos'];
      console.log('this.c', this.produtosDataservice)
      this.pushClients(this.page_limit);
    })
  }
  pushClients(page_limit) {
    this.produtos = this.produtosDataservice.slice(0, page_limit);
  }
  loadMore($event) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.produtosDataservice.length > this.page_limit + this.increaseItems) {
          this.page_limit = this.page_limit + this.increaseItems;
          this.pushClients(this.page_limit);
        }

        $event.target.complete();
        resolve();
      }, 500);
    })

  };

  async detalhes(product0) {
    const modal = await this.modalController.create({
      component: DetalhesComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        produto: product0
      }
    });
    return await modal.present();
  }
  async filter() {
    const modal = await this.modalController.create({
      component: FiltroComponent,
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }
}
