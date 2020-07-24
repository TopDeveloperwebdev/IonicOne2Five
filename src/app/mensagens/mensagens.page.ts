import { Component, OnInit } from '@angular/core';
import {dataService} from '../services/data.service'

@Component({
  selector: 'app-mensagens',
  templateUrl: './mensagens.page.html',
  styleUrls: ['./mensagens.page.scss'],
})
export class MensagensPage implements OnInit {
  mensagens : any;
  usuario : any;
  array  = [1,2,3,4,5];
  constructor(private dataService: dataService) {
    this.usuario = JSON.parse(localStorage.getItem('user'));

  }

  ngOnInit() {
    this.dataService.getMensagens(this.usuario.vendedor_id).subscribe(res => {     
      this.mensagens = res;
      console.log('res', this.mensagens);
    })
  }

}
