import { Component, OnInit } from '@angular/core';
import { dataService } from '../../services/data.service'

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {
  titulos = [];
  filtro = [];
  page_limit = 50;
  increaseTitulos = 50;
  titulosDataservice: any;
  usuario: any;
  constructor(private dataService: dataService) {
    this.usuario = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    this.dataService.getTitulos(this.usuario.vendedor_id).subscribe(res => {
      this.titulosDataservice = res;

      this.pushtitulos(this.page_limit);
    })
  }
  pushtitulos(page_limit) {
    this.titulos = this.titulosDataservice.slice(0, page_limit);
  }
  loadMore($event) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.titulosDataservice.length > this.page_limit + this.increaseTitulos) {
          this.page_limit = this.page_limit + this.increaseTitulos;
          this.pushtitulos(this.page_limit);
        }

        $event.target.complete();
        resolve();
      }, 500);
    })

  };

  verificaDataAtraso(data) {
    const dataHoje = new Date().toString();
    if (Date.parse(data) <= Date.parse(dataHoje)) {
      return 'assertive';
    } else {
      return false;
    }
  }
  totalTitulos(filtro) {
    if (typeof filtro != 'undefined' && filtro.length > 0) {
      var total = 0.00;
      for (var i in filtro) {
        total += parseFloat(filtro[i].valor);
      }

      return total.toFixed(2);
    } else {
      return 0;
    }
  }

}
