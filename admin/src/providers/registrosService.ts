import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import * as configServer from './../server';
import Registro from '../models/registro'
import { Storage } from '../../node_modules/@ionic/storage';

@Injectable()
export class RegistrosService {
  //lista de usuarios para gestion
  public registros: any;
  //solo el usuario para el DAME
  public registro: any;
  mensajeModificar: any;
  mensajeValidar: any;
  mensajeInvalidar: any;
  idAdmin: any;
  constructor(private http: Http, public storage: Storage) {
    this.storage.get('idUsuario').then(id => {
      this.idAdmin = id;
    });
  }


  cargarRegistros(filtro) {
    return new Promise<Array<Registro>>((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(configServer.data.urlServidor + '/api/registrosListar', JSON.stringify(filtro), { headers: headers })
        .map(resultado => resultado.json())
        .subscribe(resultado => {
          resolve(resultado);
        }, error => reject("Error de conexion")
        );
    });
  }

  cargarRegistrosUsuario(idRegistro) {
    return new Promise((resolve, reject) => {
      this.http.get(configServer.data.urlServidor + '/api/registrosListarUsuario/' + idRegistro)
        .map(resultado => resultado.json())
        .subscribe(resultado => {
          this.registros = resultado;
          resolve(this.registros);
        }, error => reject("Error de conexion")
        );
    });
  }

  registroDame(idRegistro) {
    return new Promise((resolve, reject) => {
      this.http.get(configServer.data.urlServidor + '/api/registroDame/' + idRegistro)
        .map(res => res.json())
        .subscribe(resultado => {
          this.registro = resultado;
          resolve(this.registro);
        }, error => reject("Error de conexion")
        );
    });
  }

  registroValidar(r) {
    return new Promise((resolve, reject) => {
      this.http.post(configServer.data.urlServidor + '/api/registroValidar/', { registros: r, idAdmin: this.idAdmin })
        .map(res => res.json())
        .subscribe(resultado => {
          this.mensajeValidar = resultado;
          resolve(this.mensajeValidar);
        }, error => reject(error)
        );
    });
  }

  registroInvalidar(r) {
    return new Promise((resolve, reject) => {
      this.http.post(configServer.data.urlServidor + '/api/registroInvalidar/', { registros: r, idAdmin: this.idAdmin })
        .map(res => res.json())
        .subscribe(resultado => {
          this.mensajeValidar = resultado;
          resolve(this.mensajeValidar);
        }, error => reject(error)
        );
    });
  }

  addComment(c) {
    return new Promise<any>((resolve, reject) => {
      this.http.post(configServer.data.urlServidor + '/api/registroAgregarComentarioAdmin/', c)
        .map(res => res.json())
        .subscribe(resultado => {
          resolve(resultado[0]);
        }, error => reject(error)
        );
    });
  }

  crearRegistro(registroCompleto) {

    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      let reg = {
        registro: registroCompleto
      }

      this.http.post(`${configServer.data.urlServidor}/api/registroNuevo`, JSON.stringify(reg), { headers: headers })
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

}