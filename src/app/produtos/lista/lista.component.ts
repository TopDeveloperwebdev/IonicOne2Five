import { Component, OnInit } from '@angular/core';
import {dataService} from '../../services/data.service'
@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {
  produtos: any;
  comissoes: any;
  verder_id = 501;
  array = [1,2,3,4,5];
  constructor( private dataService : dataService) {
   
  }

  ngOnInit() {   
    this.produtos = this.dataService.getProdutos(this.verder_id);
    // console.log('data',this.data);
  }
  detalhes(product0){
    
  }

}
