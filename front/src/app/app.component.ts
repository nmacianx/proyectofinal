import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { MapasjsPage } from '../pages/mapasjs/mapasjs';
import { MapasnativoPage } from '../pages/mapasnativo/mapasnativo';
import { HomePage } from '../pages/home/home';
import { ClouDOPage } from '../pages/clou-do/clou-do';
import { Mapajshtml } from '../pages/mapajshtml/mapajshtml';
import { SignupPage } from '../pages/signup-page/signup-page';
import { LoginPage } from '../pages/login-page/login-page';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Mapas JS', component: MapasjsPage },
      { title: 'Mapas Nativo', component: MapasnativoPage },
      { title: 'Camara', component: HomePage },
      { title: 'ClouDO', component: ClouDOPage },
      { title: 'MapaHTML', component: Mapajshtml },
      { title: 'SignupPage', component: SignupPage },
      { title: 'LoginPage', component: LoginPage },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
