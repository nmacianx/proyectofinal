import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { PhotoViewer } from 'ionic-native';
import { RegistrosService } from '../../providers/registrosService';
import { Auth } from '../../providers/auth';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login-page/login-page';

/*
  Generated class for the Registro page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html'
})
export class RegistroPage {

  idRegistro: any;
  registro: any;
  fotoPaisajeURL = 'data:image/jpeg;base64,';
  fotoMuestraURL = 'data:image/jpeg;base64,';

  constructor(public navCtrl: NavController,
              public params: NavParams,
              public regService: RegistrosService,
              public authService: Auth,
              ){
                this.idRegistro = this.params.get('idRegistro');
                this.registroDame();
              }

  registroDame() {
    this.regService.registroDame(this.idRegistro)
          .then(data => {
            this.registro = data;
            this.registro = this.registro[0];
            this.fotoPaisajeURL = this.fotoPaisajeURL + this.registro.fotoPaisaje;
            this.fotoMuestraURL = this.fotoMuestraURL + this.registro.fotoMuestra;
          });
  }

  mostrarFoto(pic){
        // let picture = 'data:image/jpeg;base64,'+pic;
        PhotoViewer.show(pic);
    }

  logout(){
    console.log('saliendo logout');
    this.authService.logout().then(()=>{
      console.log('listo borrado, dirijiendo a registrar');
      
      this.navCtrl.setRoot(LoginPage);
    });
  }

}
