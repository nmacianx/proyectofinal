import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { LoginPage } from '../login-page/login-page';
import { HomePage } from '../home/home';
import { TutorialPage } from '../tutorial/tutorial';


@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class IntroPage {

  sliderOptions: any;
  tam: any;
  width: any;
  fotoIntro: any;
  constructor(public navCtrl: NavController, public plt: Platform) {

    this.sliderOptions = {
      pager: true
    };
    this.width = plt.width();
    if (this.width <= 320) {
      this.tam = "170% 100%";
    } else if (this.width <= 450) {
      this.tam = "140% 100%";
    } else if (this.width <= 600) {
      this.tam = "110% 100%";
    } else if (this.width > 600) {
      this.tam = "100% 100%";
    }
    //  this.fotoIntro = "../assets/img/cascadaRioNoque.jpg";
    if (this.plt.is('android') || this.plt.is('ios')) {
      this.fotoIntro = "../www/assets/img/cascadaRioNoque.jpg";
    } else {
      this.fotoIntro = "../assets/img/cascadaRioNoque.jpg";
    }
  }

  tutorial() {
    this.navCtrl.push(TutorialPage);
  }

  login() {
    this.navCtrl.setRoot(LoginPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
  }

}