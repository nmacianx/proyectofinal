import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Localsave } from '../../providers/localsave';
import {File, Transfer, FilePath } from 'ionic-native';
import { Auth } from '../../providers/auth';
import { LoginPage } from '../login-page/login-page';

@Component({
  selector: 'page-mis-registros',
  templateUrl: 'mis-registros.html'
})
export class MisRegistrosPage {

  registros:any;

  constructor(public navCtrl: NavController, 
              public authService: Auth,
              public navParams: NavParams,
              public localSaveCtrl:Localsave) {
                this.localSaveCtrl.getTodos().then((data) => {
                  this.registros = data[0].registros;
                  console.log(this.registros);
                });
              }

  ionViewDidLoad() {
    
  }

  logout(){
    this.authService.logout();
    this.navCtrl.setRoot(LoginPage);
  }
}