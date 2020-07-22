import { Component, OnInit } from '@angular/core';
import { dataService } from '../../services/data.service'

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {
  items = [];
  filtro = [];
  constructor(private dataService: dataService) { }

  ngOnInit() {

    this.items = this.dataService.getTitulos(501);
  }
  verificaDataAtraso(data) {
    const dataHoje = new Date().toString();
    if (Date.parse(data) <= Date.parse(dataHoje)) {
      return 'assertive';
    } else {
      return false;
    }
  }

}
