import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.scss'],
})
export class FotosComponent implements OnInit {
  mySlideOptions = {
    pager: true
  };
  constructor(public modalController: ModalController) { }
  @Input() produto: any;
  ngOnInit() {
    console.log('produto', this.produto.http_img_1);
    this.Replacehttps('');

  }
  dismiss() {
    console.log('dismass');
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  Replacehttps(link) {   
    console.log('link', link)
    let strTemp = link.split('://');
    if (strTemp[0] == 'http') {
      link = 'https://' + strTemp[1];
    } 
    return link;
  }

}
