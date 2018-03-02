import { Component, NgZone } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';
import { Localsave } from '../../providers/localsave';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { Auth } from '../../providers/auth';
import { LoginPage } from '../login-page/login-page';
import { RegistroPage } from '../registro/registro';
import { MenuController, Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { LocalSqlProvider } from '../../providers/local-sql/local-sql';
import { RegistrosService } from '../../providers/registrosService';
import { SocketProvider } from '../../providers/socket/socket';
import { ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, animate, transition, query, stagger, keyframes } from '@angular/animations';
import { ConnectivityService } from '../../providers/connectivityService';
import 'web-animations-js/web-animations.min';
import { Events } from 'ionic-angular';

declare var Connection: any;


@Component({
  selector: 'lista-registros',
  templateUrl: 'lista-registros.html',
  animations: [

    trigger('listAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: .5, offset: 0.3 }),
            style({ opacity: 1, offset: 1.0 }),
          ]))]), { optional: true }),

        query(':leave', stagger('300ms', [
          animate('800ms ease-in', keyframes([
            style({ opacity: 1, offset: 0 }),
            style({ opacity: .5, offset: 0.3 }),
            style({ opacity: 0, offset: 1.0 }),
          ]))]), { optional: true })
      ])
    ])

  ]
})
export class ListaRegistrosPage {

  registros: any;
  registrosOnline: any = [];
  fotoMapaNoDisponible: any;

  constructor(public navCtrl: NavController,
    public authService: Auth,
    public navParams: NavParams,
    public registrosCtrl: RegistrosService,
    public socketPrv: SocketProvider,
    public alertCtrl: AlertController,
    public conexionProvider: ConnectivityService,
    private network: Network,
    public events: Events,
    public platform: Platform,
    public localSQL: LocalSqlProvider,
    private menu: MenuController,
    private _zone: NgZone) {

    this.registrosCtrl.cargarRegistros().then((registros) => {
      console.log('registros en el servidor', registros);
      this.registrosOnline = registros;
      this.registrosOnline = this.registrosOnline.reverse();
    }).catch(e => {
      this.mostrarAlerta('Error','No se puede comunicar con el servidor')
    }) 

    if (this.platform.is('cordova')) {
      this.localSQL.getAll().then((reg) => {
        console.log('registros locales', reg);
        this.registros = reg;
        if (this.registros.length > 0) {
          this.conexionProvider.subir();
        }
      });

      events.subscribe('registro:eliminado', (reg, time) => {
        console.log('eliminar registro, evento disparado', reg)
        this.borrarRegistro(reg);
      });
    }

    events.subscribe('registro:creado', (reg) => {
      this._zone.run(() => this.registrosOnline.unshift(reg.registro));
    });

  }

  ionViewDidLoad() {

  }

  borarDB() {
    this.localSQL.destruirDB();
  }

  borrarRegistro(registro) {
    let id = registro.idRegistro;
    let index = this.registros.map(function (reg) { return reg.idRegistro; }).indexOf(id);
    this._zone.run(() => this.registros.splice(index, 1));
    setTimeout(() => {
      this.socketPrv.publicar(registro);
    }, 1000);
  }

  fakeRegitro() {
    this.localSQL.fakeRegistro().subscribe((res) => {
      res = res[0];
      this.registros.unshift(res);
      this.socketPrv.publicar(res);
    });
  }

  irAlRegistro(id) {
    this.navCtrl.push(RegistroPage, { idRegistro: id })
  }

  mostrarAlerta(titulo, mensaje) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      buttons: ['ACEPTAR']
    });
    alert.present();
  }
}