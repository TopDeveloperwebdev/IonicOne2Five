import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { dataService } from '../services/data.service';
import { DBService } from '../services/DB.service'
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
  db: any
  constructor(private dataService: dataService, public dbService: DBService) {
    this.db = dbService;


  }

  async ngOnInit() {

    this.db.metas.toArray().then(res => {
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
