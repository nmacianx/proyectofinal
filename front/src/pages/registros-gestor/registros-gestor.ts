import { Component, NgZone } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { Auth } from '../../providers/auth';
import { LoginPage } from '../login-page/login-page';
import { RegistrosService } from '../../providers/registrosService';
import { RegistroPage } from '../registro/registro';
/*
  Generated class for the RegistrosGestor page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-registros-gestor',
  templateUrl: 'registros-gestor.html'
})
export class RegistrosGestorPage {

  public registros: any;
  ordInd: any = null;
  ordReg: any = null;
  ordFec: any = null;
  ordEst: any = null;

  constructor(public navCtrl: NavController,
              public regService: RegistrosService,
              public alertCtrl: AlertController,
              public authService: Auth,
              ){
                  this.cargarRegistros();
              }

              
    cargarRegistros(){
      this.regService.cargarRegistros()
        .then(data => {
          this.registros = data;
          for(let r of this.registros){
            if(r.elmido == 1){
              r.elmido = 'Si';
            }else{
              r.elmido = 'No';
            }
            if(r.patudo == 1){
              r.patudo = 'Si';
            }else{
              r.patudo = 'No';
            }
            if(r.plecoptero == 1){
              r.plecoptero = 'Si';
            }else{
              r.plecoptero = 'No';
            }
            if(r.tricoptero == 1){
              r.tricoptero = 'Si';
            }else{
              r.tricoptero = 'No';
            }

            if(r.valido == -1){
              r.valido = 'Invalido';
            }else{
               if(r.valido == 0){
                  r.valido = 'Pendiente de validacion';
               }else{
                 r.valido = 'Valido';
               }
            }
            
          }
        }) ;
    }    

    ordenarRegistro(){
      this.ordInd = null;
      this.ordFec = null;
      this.ordEst = null;

      switch (this.ordReg)
          {
            case "ascendente":
              this.ordReg = "descendente";
              this.registros.sort(function(a,b) { //La funcion sort ordena numeros, si quiero de menor a mayor a es 'a-b', si quiero de mayo a menor b-a
                  return b.idRegistro - a.idRegistro;
              });
              break;
            case "descendente" :
              this.ordReg = "ascendente";
              this.registros.sort(function(a,b) { //La funcion sort ordena numeros, si quiero de menor a mayor a es 'a-b', si quiero de mayo a menor b-a
                  return a.idRegistro - b.idRegistro;
              });
              break;
            case null:
              this.ordReg = "ascendente";
              this.registros.sort(function(a,b) { //La funcion sort ordena numeros, si quiero de menor a mayor a es 'a-b', si quiero de mayo a menor b-a
                  return a.idRegistro - b.idRegistro;
              });
              break;
          }
    }

    ordenarFecha(){
      this.ordReg = null;
      this.ordInd = null;
      this.ordEst = null;
      
      switch (this.ordFec)
          {
            case "ascendente":
              this.ordFec = "descendente";
              this.registros.sort(function(a,b) { //La funcion sort ordena numeros, si quiero de menor a mayor a es 'a-b', si quiero de mayo a menor b-a
                  return b.fecha - a.fecha;
              });
              break;
            case "descendente" :
              this.ordFec = "ascendente";
              this.registros.sort(function(a,b) { //La funcion sort ordena numeros, si quiero de menor a mayor a es 'a-b', si quiero de mayo a menor b-a
                  return a.fecha - b.fecha;
              });
              break;
            case null:
              this.ordFec = "ascendente";
              this.registros.sort(function(a,b) { //La funcion sort ordena numeros, si quiero de menor a mayor a es 'a-b', si quiero de mayo a menor b-a
                  return a.fecha - b.fecha;
              });
              break;
          }
    }

    ordenarIndice(){
      this.ordReg = null;
      this.ordFec = null;
      this.ordEst = null;
      
      switch (this.ordInd)
          {
            case "ascendente":
              this.ordInd = "descendente";
              this.registros.sort(function(a,b) { //La funcion sort ordena numeros, si quiero de menor a mayor a es 'a-b', si quiero de mayo a menor b-a
                  return b.indice - a.indice;
              });
              break;
            case "descendente" :
              this.ordInd = "ascendente";
              this.registros.sort(function(a,b) { //La funcion sort ordena numeros, si quiero de menor a mayor a es 'a-b', si quiero de mayo a menor b-a
                  return a.indice - b.indice;
              });
              break;
            case null:
              this.ordInd = "ascendente";
              this.registros.sort(function(a,b) { //La funcion sort ordena numeros, si quiero de menor a mayor a es 'a-b', si quiero de mayo a menor b-a
                  return a.indice - b.indice;
              });
              break;
          }
    }

    ordenarEstado(){
      this.ordReg = null;
      this.ordFec = null;
      this.ordInd = null;
      
      switch (this.ordEst)
          {
            case "ascendente":
              this.ordEst = "descendente";
              this.registros.sort(function(a,b) { //La funcion sort ordena numeros, si quiero de menor a mayor a es 'a-b', si quiero de mayo a menor b-a
                  return b.valido - a.valido;
              });
              break;
            case "descendente" :
              this.ordEst = "ascendente";
              this.registros.sort(function(a,b) { //La funcion sort ordena numeros, si quiero de menor a mayor a es 'a-b', si quiero de mayo a menor b-a
                  return a.valido - b.valido;
              });
              break;
            case null:
              this.ordEst = "ascendente";
              this.registros.sort(function(a,b) { //La funcion sort ordena numeros, si quiero de menor a mayor a es 'a-b', si quiero de mayo a menor b-a
                  return a.valido - b.valido;
              });
              break;
          }
    }

    ver(idRegistro){
      console.log(idRegistro);
      this.navCtrl.push(RegistroPage,{idRegistro});
    }

    logout(){
        console.log('saliendo logout');
        this.authService.logout().then(()=>{
            console.log('listo borrado, dirijiendo a registrar');
            this.navCtrl.setRoot(LoginPage);
        });
    }

}
