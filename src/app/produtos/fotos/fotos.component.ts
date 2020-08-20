import { Component, OnInit ,Input} from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.scss'],
})
export class FotosComponent implements OnInit {
  mySlideOptions = {
    pager:true
  };
  constructor(public modalController: ModalController) { }
  @Input() produto: any;
  ngOnInit() {
    console.log('produto',this.produto); 
 
   }
  dismiss() {
    console.log('dismass');
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
