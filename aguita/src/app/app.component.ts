import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../pages/login-page/login-page';
import { TabsPage } from '../pages/tabs/tabs';
import { MisRegistrosPage } from '../pages/mis-registros/mis-registros';
import { LocalSqlProvider } from '../providers/local-sql/local-sql';
import { SocketProvider } from '../providers/socket/socket';
import { ConnectivityService } from '../providers/connectivityService';
import { Events } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { MapaGeneralPage } from '../pages/mapa-general/mapa-general';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(
    public platform: Platform,
    statusBar: StatusBar,
    conexion: ConnectivityService,
    public localSQL: LocalSqlProvider,
    public scoketPrv: SocketProvider,
    public events: Events,
    private keyboard: Keyboard,
    public storage: Storage,
    splashScreen: SplashScreen) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      if (this.platform.is('cordova')) {
        this.localSQL.createDatabase();

        keyboard.onKeyboardShow().subscribe(() => {
          console.log('se abrio el teclado')
          document.body.classList.add('keyboard-is-open');
        });

        keyboard.onKeyboardHide().subscribe(() => {
          document.body.classList.remove('keyboard-is-open');
        });
      }

      this.storage.get('token').then((token) => {
        console.log('token is', token);
        if (token === '' || token === null || token === undefined) {
          this.rootPage = LoginPage;
        } else {
          this.storage.get('idUsuario').then((idUsuario) => {
            this.scoketPrv.init(idUsuario);
            // this.rootPage = TabsPage;
            this.rootPage = MapaGeneralPage;
          })
        }
      }).catch((err) => {
        console.log(err);
      });

    });
  }
}
