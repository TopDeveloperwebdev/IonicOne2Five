import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-titulos',
  templateUrl: './titulos.component.html',
  styleUrls: ['./titulos.component.scss'],
})
export class TitulosComponent implements OnInit {
  items = [];
  filtro = [];
  nomeCliente = "ADONAL RACOES E BAZAR LTDA ME";
  constructor() { }


  ngOnInit() { }

}
