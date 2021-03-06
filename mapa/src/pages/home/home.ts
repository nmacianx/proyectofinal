import { Component, ViewChild, ElementRef } from '@angular/core';
//ActionSheetController menu de opciones nativas.
//ToastController modal nativo
import { ModalController, ViewController, NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading, AlertController, MenuController } from 'ionic-angular';
import { ModalPage } from '../modal/modal';
import { Camara } from '../../providers/camara';
import { Ubicacion } from '../../providers/ubicacion';
import { Localsave } from '../../providers/localsave';
import { DiagnosticProvider } from '../../providers/diagnostic/diagnostic';
import { LocalSqlProvider } from '../../providers/local-sql/local-sql';
import { RegistrosService } from '../../providers/registrosService';
import { ConnectivityService } from '../../providers/connectivityService';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Wheel } from '../wheel/wheel';
import { Auth } from '../../providers/auth';
import { DomSanitizer } from '@angular/platform-browser';
import { MisRegistrosPage } from '../mis-registros/mis-registros';
import { FormGroup, FormControl } from '@angular/forms';
import { Content } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { App } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { CropperPage } from '../cropper/cropper';



@Component({
  selector: 'home-page',
  templateUrl: 'home.html',
})

export class HomePage {
  @ViewChild('micontenedor') contenedor: ElementRef;
  @ViewChild(Content) content: Content;
  animacionMapaFin: boolean = false;
  claseHeader: string;
  idUsuario: number;
  altoMapa: number;
  urlImg: string;
  registro: string = "mapa";
  fotoPaisajeURL = 'data:image/jpeg;base64,';
  fotoPaisaje: any;
  fotoMuestra: any;
  fotoMapa: any = '';
  fotoMuestraURL = 'data:image/jpeg;base64,';
  listaDBlocal: any;
  latitud: any;
  longitud: any;
  latitudFoto: any;
  logintudFoto: any;
  coordenadas: any;
  imagenenBase64 = '';
  fotoPaisajeURLSafe: any;
  fotoMuestraURLSafe: any;
  muestroMapaNativo = false;
  loading: any;
  fotoElmido;
  realElmido;
  fotoPatudo;
  realPatudo;
  fotoPlecoptero;
  realPlecoptero;
  fotoTricoptero;
  realTricoptero;
  observaciones;
  insectos: any;
  respuesta;
  registroCompleto;
  coincidencia = new FormGroup({
    "observaciones": new FormControl(),
  });

  constructor(public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    private photoViewer: PhotoViewer,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private menuCtrl: MenuController,
    public camaraCtrl: Camara,
    public authService: Auth,
    public app: App,
    public events: Events,
    private sanitizer: DomSanitizer,
    public conexionProvider: ConnectivityService,
    public ubicacionCtrl: Ubicacion,
    private geolocation: Geolocation,
    public localSaveCtrl: Localsave,
    public registroController: RegistrosService,
    public localSQL: LocalSqlProvider,
    public diagnosticProvider: DiagnosticProvider,
    public alertCtrl: AlertController,
    public storage: Storage
  ) {
    this.storage.get('idUsuario').then(id => this.idUsuario = id);
    this.menuCtrl.enable(false);
    //Detecta la ubicacion
    this.ubicacion()
      .then(res => {
        this.latitud = res[0];
        this.longitud = res[1];
        if (this.platform.is('cordova')) {
          this.muestroMapaNativo = true;
          //espero a la animacion para habilitar el boton siguiente, porque sino el mapa nativo aparece de background en los otros tabs...
          setTimeout(() => {
            this.animacionMapaFin = true;
          }, 3000);
        }
      })
      .catch(() => {
        this.mostrarAlerta("ERROR", "No se pudo obtener la ubicacion")
      });

    (this.platform.is('android')) ? this.claseHeader = "androidHeader" : false;
    (this.platform.is('ios')) ? this.claseHeader = "iosHeader" : false;
    //Para usar mapa nativo o mapaHTML


    //FOTOS PARA PASO 2 RADIO BUTTON
    if (this.platform.is('cordova')) {
      this.urlImg = '../www/'
    } else {
      this.urlImg = '../'
    }
    this.fotoElmido = this.urlImg + "assets/img/Elmidos.png";
    this.fotoPatudo = this.urlImg + "assets/img/Patudos.png";
    this.fotoPlecoptero = this.urlImg + "assets/img/Plecoptero.png";
    this.fotoTricoptero = this.urlImg + "assets/img/Tricoptero.png";
    // Para fotos reales del modal
    this.realElmido = this.urlImg + "assets/img/fElmido.jpg";
    this.realPatudo = this.urlImg + "assets/img/fPatudo.jpg";
    this.realPlecoptero = this.urlImg + "assets/img/fPlecoptero.jpg";
    this.realTricoptero = this.urlImg + "assets/img/fTricoptero.jpg";

    this.insectos = {
      elmido: null,
      patudo: null,
      plecoptero: null,
      tricoptero: null
    }
  }

  cancelarBoton() {
    this.navCtrl.setRoot(TabsPage);
  }

  public move(bicho) {
    let yOffset = document.getElementById(bicho).offsetTop;
    this.content.scrollTo(0, yOffset - 50, 500);
  }

  ionViewDidLoad() {
    this.altoMapa = (this.contenedor.nativeElement.offsetHeight) - 250;
  }

  openModal(pic, name) {
    let modal = this.modalCtrl.create(ModalPage, { foto: pic, nombre: name });
    modal.present();
  }

  modalCropper(pic) {
    return new Promise((resolve, reject) => {
      let modal = this.modalCtrl.create(CropperPage, { imagen: pic, aspectRatio: 0 });
      modal.onDidDismiss(data => {
        return resolve(data);
      });
      modal.present();
    })
  }


  async takefotoPaisaje() {
    let data = await this.camaraCtrl.takePicture64();
    let cropped = await this.modalCropper(data);
    this.fotoPaisaje = cropped;
    this.obtenerUbicacion()
      .then(res => {
        console.log(res)
        this.latitudFoto = res[0];
        this.logintudFoto = res[1];
      })
      .catch(err => {
        console.log(err)
      });
    this.fotoPaisajeURL = this.fotoPaisajeURL + this.fotoPaisaje;
    this.fotoPaisajeURLSafe = this.sanitizer.bypassSecurityTrustUrl(this.fotoPaisajeURL);
  }

  async takefotoMuestra() {
    let data = await this.camaraCtrl.takePicture64();
    let cropped = await this.modalCropper(data);
    this.fotoMuestra = cropped;
    this.fotoMuestraURL = this.fotoMuestraURL + this.fotoMuestra;
    this.fotoMuestraURLSafe = this.sanitizer.bypassSecurityTrustUrl(this.fotoMuestraURL);
  }

  mostrarFoto(pic) {
    switch (pic) {
      case "fotoPaisaje":
        let picture = 'data:image/jpeg;base64,' + pic;
        this.photoViewer.show(picture);
        break;

      default:
        break;
    }

  }

  deleteFoto(del) {
    if (del === 'paisaje') {
      this.fotoPaisaje = null;
      this.fotoPaisajeURL = 'data:image/jpeg;base64,';
    }
    else {
      this.fotoMuestra = null;
      this.fotoMuestraURL = 'data:image/jpeg;base64,';
    }
  }


  public pasoAnterior() {
    switch (this.registro) {
      case "fotos":
        return this.registro = "mapa";
      case "obseravaciones":
        return this.registro = "fotos";
    }
  }

  public siguientePaso() {
    switch (this.registro) {
      case "mapa":
        return this.registro = "fotos";
      case "fotos":
        return this.registro = "obseravaciones";
      case "obseravaciones":
        this.controlDeDatos();
    }
  }

  insectosEncontrados(nombre, coincidencia) {
    console.log("insecotsEcnotrados antes", this.insectos)
    switch (nombre) {
      case 'elmido':
        (coincidencia == 'si') ? this.insectos.elmido = 'si' : this.insectos.elmido = 'no';
        break;
      case 'patudo':
        (coincidencia == 'si') ? this.insectos.patudo = 'si' : this.insectos.patudo = 'no';
        break;
      case 'plecoptero':
        (coincidencia == 'si') ? this.insectos.plecoptero = 'si' : this.insectos.plecoptero = 'no';
        break;
      case 'tricoptero':
        (coincidencia == 'si') ? this.insectos.tricoptero = 'si' : this.insectos.tricoptero = 'no';
        break;

      default:
        break;
    }
    console.log("insectos encontrados switch assign", this.insectos)
  }

  controlDeDatos() {

    let elmidos = this.insectos.elmido;
    let plecopteros = this.insectos.plecoptero;
    let tricopteros = this.insectos.tricoptero;
    let patudos = this.insectos.patudo;
    let observaciones = (this.coincidencia.value.observaciones === null) ? this.coincidencia.value.observaciones = '' : this.coincidencia.value.observaciones;
    if (this.fotoPaisaje != null && this.fotoMuestra != null) {
      if (elmidos == null || plecopteros == null || tricopteros == null || patudos == null) {
        let titulo = "Encuesta";
        let mensaje = "Debe seleccionar SI o NO para cada insecto."
        this.mostrarAlerta(titulo, mensaje);
      } else {
        this.crearRegistro(patudos, elmidos, plecopteros, tricopteros, observaciones);
      }
    } else {
      if (this.fotoPaisaje == null && this.fotoMuestra == null) {
        let titulo = "Fotos no tomadas";
        let mensaje = "Por favor, tomar las fotos correspondientes para poder continuar";
        this.mostrarAlerta(titulo, mensaje);
      } else {
        if (this.fotoPaisaje == null) {
          let titulo = "Foto paisaje";
          let mensaje = "Por favor, tomar una foto del paisaje antes de continuar";
          this.mostrarAlerta(titulo, mensaje);
        } else {
          if (this.fotoMuestra == null) {
            let titulo = "Foto muestra";
            let mensaje = "Por favor, tomar una foto de la muestra antes de continuar";
            this.mostrarAlerta(titulo, mensaje);
          }
        }
      }
    }
  }

  public calcularIndice(patudos, elmidos, plecopteros, tricopteros) {
    let i = 0;
    if (patudos === 'si') {
      i++;
    }
    if (elmidos === 'si') {
      i++;
    }
    if (plecopteros === 'si') {
      i++;
    }
    if (tricopteros === 'si') {
      i++;
    }
    return i;
  }

  public crearRegistro(patudos, elmidos, plecopteros, tricopteros, observaciones) {
    let i = this.calcularIndice(patudos, elmidos, plecopteros, tricopteros)
    let registro = {
      indice: i,
      fecha: new Date().toISOString(),
      latitud: this.latitud,
      longitud: this.longitud,
      latitudFoto: this.latitudFoto,
      longitudFoto: this.logintudFoto,
      fotoPaisaje: this.fotoPaisaje,
      fotoMuestra: this.fotoMuestra,
      fotoMapa: '',
      observacion: observaciones,
      elmidos: elmidos,
      patudos: patudos,
      plecopteros: plecopteros,
      tricopteros: tricopteros,
      idUsuario: this.idUsuario,
    }
    let inicio = registro.fecha.split('.');
    registro.fecha = inicio[0];
    this.localSQL.create(registro).then((res) => {
      this.app.getRootNav().setRoot(Wheel, { indice: i });
    }).catch((error) => {
      console.log(error);
      this.mostrarAlerta('Error', 'No se pudo crear el registro local.');
      this.navCtrl.setRoot(MisRegistrosPage);
    });;
  }

  mostrarAlerta(titulo, mensaje) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      buttons: ['ACEPTAR']
    });
    alert.present();
  }

  ubicacion() {
    return new Promise((resolve, reject) => {
      this.diagnosticProvider.controlEnable()
        .then(() => {
          this.obtenerUbicacion()
            .then(res => {
              resolve(res)
            })
            .catch(err => {
              reject(err)
            });
        })
        .catch(() => {
          reject("err");
        })
    });
  }

  public obtenerUbicacion() {
    let text = 'Espere mientras cargamos la ubicacion';
    this.showLoader(text);
    return this.geolocation.getCurrentPosition().then((resp) => {
      this.loading.dismiss();
      return Promise.resolve([resp.coords.latitude, resp.coords.longitude]);
    }).catch((error) => {
      this.loading.dismiss();
      return Promise.reject("err")
    });
  }


  showLoader(text) {
    this.loading = this.loadingCtrl.create({
      content: text
    });
    this.loading.present();
  }

  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}