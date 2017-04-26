import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
import { RegistrosService } from '../../providers/registrosService';
import { Auth } from '../../providers/auth';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login-page/login-page';
import { UsuarioPage } from '../usuario/usuario';
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
  fotoMapaURL = 'data:image/jpeg;base64,';
  fotoPaisajeURLSafe:any;
  fotoMuestraURLSafe:any;
  fotoMapaURLSafe: any;
  valido: any;
  rol=null;
  // Atributos del registro que viene de mysql:
  // *idRegistro
  // *indice
  // *fecha
  // *latitud
  // *longitud
  // *observacion
  // *valido
  // **idUsuario
  // **nombreUsuario ** inner join con usuarios en idUsuario
  // *elmido
  // *patudo
  // *plecoptero
  // *tricoptero
  // *ciudad
  // *provincia
  // *pais
  // *fotoPaisaje
  // *fotoMuestra
  // *fotoMapa

  constructor(public navCtrl: NavController,
              public params: NavParams,
              public regService: RegistrosService,
              public authService: Auth,
              private sanitizer:DomSanitizer,
              public storage: Storage,
              public alertCtrl: AlertController,
              ){
                this.dameRol();
                this.idRegistro = this.params.get('idRegistro');
                console.log("en registroPage");
                console.log(this.idRegistro);
                this.registroDame();
              }

  registroDame() {
    this.regService.registroDame(this.idRegistro)
          .then(data => {
            this.registro = data;
            this.registro = this.registro[0];
            this.fotoPaisajeURL = this.fotoPaisajeURL + this.registro.fotoPaisaje;
            this.fotoMuestraURL = this.fotoMuestraURL + this.registro.fotoMuestra;
            this.fotoMapaURL = this.fotoMapaURL + this.registro.fotoMapa;
            this.fotoPaisajeURLSafe= this.sanitizer.bypassSecurityTrustUrl(this.fotoPaisajeURL );
            this.fotoMuestraURLSafe= this.sanitizer.bypassSecurityTrustUrl(this.fotoMuestraURL );
            this.fotoMapaURLSafe= this.sanitizer.bypassSecurityTrustUrl(this.fotoMapaURL );
            this.validoToArray();
            if(this.registro.observacion == "null"){
              this.registro.observacion = "No hay observaciones."
            }
            console.log(this.registro);
          });
  }

  validoToArray(){
    if(this.registro.valido == -1){
      this.valido = 'Invalido';
    }else{
        if(this.registro.valido == 0){
          this.valido = 'Pendiente de validacion';
        }else{
          this.valido = 'Valido';
        }
    }
  }

  validarRegistro(idRegistro){
    this.regService.registroValidar(this.registro.idRegistro)
      .then(data => {
        let mensajeBaja = data;
        if(mensajeBaja[0].codigo > 0){
          let titulo = "Correcto";
          let mensaje = mensajeBaja[0].mensaje;
          this.mostrarAlerta(mensaje,titulo);
          //eliminamos del vector usuarios, el que acabamos de eliminar, por el TWO DATA BINDING en el componente GESTOR USUARIOS, para modificar el DOM
          for (let r of this.regService.registros) {
              if(r.idRegistro == this.registro.idRegistro){
                  this.regService.registros.valido = 1; // el primera variable es el elemento del array (0-n indexado)
              }
          }
          this.registro.valido = 1;
          this.validoToArray();
        }else{
          let titulo = "Error";
           let mensaje = mensajeBaja[0].mensaje;
            this.mostrarAlerta(mensaje,titulo);
        }
        });
  }

  invalidarRegistro(idRegistro){
    this.regService.registroInvalidar(this.registro.idRegistro)
      .then(data => {
        let mensajeBaja = data;
        if(mensajeBaja[0].codigo > 0){
          let titulo = "Correcto";
          let mensaje = mensajeBaja[0].mensaje;
          this.mostrarAlerta(mensaje,titulo);
          //eliminamos del vector usuarios, el que acabamos de eliminar, por el TWO DATA BINDING en el componente GESTOR USUARIOS, para modificar el DOM
          for (let r of this.regService.registros) {
              if(r.idRegistro == this.registro.idRegistro){
                  this.regService.registros.valido = -1; // el primera variable es el elemento del array (0-n indexado)
              }
          }
          this.registro.valido = -1;
          this.validoToArray();
        }else{
          let titulo = "Error";
           let mensaje = mensajeBaja[0].mensaje;
            this.mostrarAlerta(mensaje,titulo);
        }
        });
  }

  verUsuario(idUsuario){
      console.log(idUsuario);
      this.navCtrl.push(UsuarioPage,{idUsuario});
  }

  mensajeConfirmar(idRegistro,accion) {
    let confirm = this.alertCtrl.create({
      title: accion.charAt(0).toUpperCase()+accion.slice(1)+' Registro',
      message: '¿Esta seguro que desea '+accion+' el Registro N° '+this.registro.idRegistro+'?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            if(accion == 'validar'){
              this.validarRegistro(idRegistro);
              
            }else{
              this.invalidarRegistro(idRegistro);
            }
          }
        }
      ]
    });
    confirm.present();
  }

  mostrarAlerta(mensaje,titulo) {
      let alert = this.alertCtrl.create({
        title: titulo,
        subTitle: mensaje,
        buttons: ['ACEPTAR']
      });
      alert.present();
    }

  dameRol(){
    this.storage.get('rol').then((value) => {
          this.rol = value;
      });
  }


  logout(){
    console.log('saliendo logout');
    this.authService.logout().then(()=>{
      console.log('listo borrado, dirijiendo a registrar');
      
      this.navCtrl.setRoot(LoginPage);
    });
  }

}
