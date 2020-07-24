import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { dataService } from '../services/data.service'
@Component({
  selector: 'app-metas',
  templateUrl: './metas.page.html',
  styleUrls: ['./metas.page.scss'],
})
export class MetasPage implements OnInit {
  @ViewChild('barChart') barChart;
  bars: any;
  colorArray: any;
  usuario: any;
  metas: any;
  meta_id: '';
  constructor(private dataService: dataService) {
    this.usuario = JSON.parse(localStorage.getItem('user'));

  }

  ngOnInit() {
    this.dataService.getMetas(this.usuario.vendedor_id).subscribe(res => {
      console.log('res', res);
      this.metas = res;
    })
  }
  selectChar(meta_id) {
    if (meta_id) {
      var meta = this.metas.filter(function (meta) {
        return meta.meta_id == meta_id;
      });
      this.gerarGrafico(meta[0].valormeta, meta[0].valoratingido);
    }
  }

  gerarGrafico(valormeta, valoratingido) {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Meta', 'Valor Atingido'],
        datasets: [{
          label: 'metas',
          data: [valormeta, valoratingido],
          backgroundColor: [
            '#cde5ec9c',
            '#d6d6d652',
          ],
          borderColor: [
            '#cde5ec',
            '#d6d6d6',
          ],
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              height: 5000
            },


          }]
        }
      }
    });
  }
}
