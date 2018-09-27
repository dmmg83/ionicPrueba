import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ReciboPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recibo',
  templateUrl: 'recibo.html',
})
export class ReciboPage {

  pChildData:any;

  retornar;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.pChildData = this.navParams.get("datosRecibo");
    this.retornar=this.navParams.get("callback");
    console.log(this.pChildData);    
  }

  aceptar(){
    this.retornar(true).then(()=>{
      this.navCtrl.pop();
  });
  }

  cancelar(){
    this.retornar(false).then(()=>{
      this.navCtrl.pop();
  });
  }

}
