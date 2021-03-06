import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ListaRegistrosPage } from '../pages/lista-registros/lista-registros';
import { ListaUsuariosPage } from '../pages/lista-usuarios/lista-usuarios';
import { LoginPage } from '../pages/login-page/login-page';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{ tituloPrincipal: string, iconoPrincipal: string, activo: boolean, componenentes: any }>;

  constructor(platform: Platform,
    public storage: Storage,
    Splashscreen: SplashScreen) {
    platform.ready().then(() => {
      Splashscreen.hide();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.pages = [
        { tituloPrincipal: 'Usuarios', iconoPrincipal: 'face', activo: false, componenentes: ListaUsuariosPage },
        { tituloPrincipal: 'Registros', iconoPrincipal: 'assignment', activo: true, componenentes: ListaRegistrosPage },
      ];
      this.storage.get('token').then((token) => {
        if (token === '' || token === null || token === undefined) {
          this.rootPage = LoginPage;
        } else {
          this.rootPage = ListaRegistrosPage;
        }
      }).catch((err) => {
        console.log(err);
      });

    });
  }

  openPage(page) {
    for (let p of this.pages) {
      p.activo = false;
    }
    page.activo = true;
    this.nav.setRoot(page.componenentes);
  }

  logout() {
    this.storage.set('token', '');
    this.storage.set('idUsuario', '');
    this.storage.set('user', '');
    this.storage.set('rol', '');
    this.nav.setRoot(LoginPage);
  }

}

