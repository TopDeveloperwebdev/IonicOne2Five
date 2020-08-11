import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/data.service';
import { DBService } from '../services/DB.service'

@Component({
  selector: 'app-mensagens',
  templateUrl: './mensagens.page.html',
  styleUrls: ['./mensagens.page.scss'],
})
export class MensagensPage implements OnInit {

  usuario: any;
  mensagens: any;
  emptyMessage = '';
  db: any
  constructor(private dataService: dataService, public dbService: DBService) {
    this.db = dbService;


  }

  async ngOnInit() {
    this.db.mensagem.toArray().then(res => {
      this.mensagens = res;
    })
  }


}
