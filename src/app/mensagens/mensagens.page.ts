import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/data.service'

@Component({
  selector: 'app-mensagens',
  templateUrl: './mensagens.page.html',
  styleUrls: ['./mensagens.page.scss'],
})
export class MensagensPage implements OnInit {

  usuario: any;
  mensagens: any;
  emptyMessage = '';
  constructor(private dataService: dataService) {
    this.usuario = JSON.parse(localStorage.getItem('user'));

  }

  ngOnInit() {
    this.dataService.getMensagens(this.usuario.vendedor_id).subscribe(res => {
      if (res[length]) this.mensagens = res;
      else {
        this.emptyMessage = "Nenhuma mensagem encontrada.";
      }
    })
  }

}
