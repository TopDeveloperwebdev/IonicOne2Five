import { Component, OnInit } from '@angular/core';
import { dataService } from '../../services/data.service';
import { ActionSheetController ,NavController } from '@ionic/angular';
@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {

  verder_id = 501;
  clientes = [];
  constructor(private dataService: dataService, public actionSheetController: ActionSheetController , private navCtl : NavController) { }

  ngOnInit() {

    this.clientes = this.dataService.getClients(this.verder_id);


  }
  loadMore = function () {

  };
  async opcoes(cliente_id, razaosocial){
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Pedidos',
        role: 'destructive',
        icon: 'ion-android-list',
        handler: () => {
         this.navCtl.navigateForward('clientes/pedidos');
        }
      }, {
        text: 'Cadastro',
        icon: 'edit',
        handler: () => {
            this.navCtl.navigateForward('clientes/cadastro');
        }
      }, {
        text: 'Títulos',
        icon: 'filing',
        handler: () => {
           this.navCtl.navigateForward('clientes/titulos');
        }
      }, {
        text: 'Motivos de Não Venda',
        icon: 'listBox',
        handler: () => {
          console.log('Favorite clicked');
        }
      }]
     
    });
    await actionSheet.present();
  }
  cadastro(){
    this.navCtl.navigateForward('clientes/cadastro');
  }
 
}