import { Component, ViewChild, ElementRef } from '@angular/core';
//ActionSheetController menu de opciones nativas.
//ToastController modal nativo
import { ModalController, ViewController, NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading, AlertController } from 'ionic-angular';
import { Camera, File, Transfer, FilePath } from 'ionic-native';
import { Mapjshtml } from '../pages/mapajshtml/mapajshtml';
import { MapasnativoPage } from '../pages/mapasnativo/mapasnativo';
import { ModalPage } from '../modal/modal';
import { Camara } from '../../providers/camara';
import { Ubicacion } from '../../providers/ubicacion';
import { Localsave } from '../../providers/localsave';
import { PhotoViewer } from 'ionic-native';
import { Wheel } from '../wheel/wheel';
import { Auth } from '../../providers/auth';
import { LoginPage } from '../login-page/login-page';
import {DomSanitizer} from '@angular/platform-browser';
import { MisRegistrosPage } from '../mis-registros/mis-registros';
import { FormGroup, FormControl } from '@angular/forms';
import { Content } from 'ionic-angular';

@Component({
    selector: 'home-page',
    templateUrl: 'home.html',
})

export class HomePage {
    @ViewChild('micontenedor') contenedor: ElementRef;
    @ViewChild(Content) content: Content;
    altoMapa:number;
    registro: string = "mapa";
    fotoPaisajeURL = 'data:image/jpeg;base64,';
    fotoPaisaje:any;
    fotoMuestra:any;
    fotoMuestraURL = 'data:image/jpeg;base64,';
    listaDBlocal:any;
    latitud:any;
    longitud:any;
    coordenadas: any;
    imagenenBase64 = '';
    fotoPaisajeURLSafe:any;
    fotoMuestraURLSafe:any;
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
    coincidencia = new FormGroup({
      "elmidos": new FormControl(),
      "patudos": new FormControl(),
      "plecopteros": new FormControl(),
      "tricopteros": new FormControl(),
      "observaciones": new FormControl(),
    });

    constructor(public navCtrl: NavController, 
                public actionSheetCtrl: ActionSheetController, 
                public toastCtrl: ToastController, 
                public platform: Platform, 
                public loadingCtrl: LoadingController,
                public modalCtrl: ModalController,
                public camaraCtrl:Camara,
                public authService: Auth,
                private sanitizer:DomSanitizer,
                public ubicacionCtrl:Ubicacion,
                public localSaveCtrl:Localsave,
                public alertCtrl: AlertController
                ){
                    // //Es para hacer responsive el mapa
                    // if((this.platform.height() > 600) && (this.platform.height() < 801)){
                    //     this.altoMapa = 500;
                    // }else{
                    //     if(this.platform.height() > 801){
                    //         this.altoMapa = 600;
                    //     }else{
                    //         this.altoMapa = 220;
                    //     }
                    // }

                    //Detecta la ubicacion
                    this.ubicacion();

                    //Para usar mapa nativo o mapaHTML
                    if(this.platform.is('android') || this.platform.is('ios')){
                        this.muestroMapaNativo = true;
                    }

                    //FOTOS PARA PASO 2 RADIO BUTTON
                    if(this.platform.is('android') || this.platform.is('ios')){
                        this.fotoElmido = "../www/assets/img/Elmidos.jpg";
                    }else{
                        this.fotoElmido = "../assets/img/Elmidos.jpg";
                    }

                    if(this.platform.is('android') || this.platform.is('ios')){
                        this.fotoPatudo = "../www/assets/img/Patudo.jpg";
                    }else{
                        this.fotoPatudo = "../assets/img/Patudo.jpg";
                    }

                    if(this.platform.is('android') || this.platform.is('ios')){
                        this.fotoPlecoptero = "../www/assets/img/Plecoptero.jpg";
                    }else{
                        this.fotoPlecoptero = "../assets/img/Plecoptero.jpg";
                    }

                    if(this.platform.is('android') || this.platform.is('ios')){
                        this.fotoTricoptero = "../www/assets/img/Tricoptero.jpg";
                    }else{
                        this.fotoTricoptero = "../assets/img/Tricoptero.jpg";
                    }

                    if(this.platform.is('android') || this.platform.is('ios')){
                        this.fotoElmido = "../www/assets/img/Elmidos.jpg";
                    }else{
                        this.fotoElmido = "../assets/img/Elmidos.jpg";
                    }

                    //FOTOS REALES PARA MODAL!
                    if(this.platform.is('android') || this.platform.is('ios')){
                        this.realElmido = "../www/assets/img/fElmido.jpg";
                    }else{
                        this.realElmido = "../assets/img/fElmido.jpg";
                    }

                    if(this.platform.is('android') || this.platform.is('ios')){
                        this.realPatudo = "../www/assets/img/fPatudo.jpg";
                    }else{
                        this.realPatudo = "../assets/img/fPatudo.jpg";
                    }

                    if(this.platform.is('android') || this.platform.is('ios')){
                        this.realPlecoptero = "../www/assets/img/fPlecoptero.jpg";
                    }else{
                        this.realPlecoptero = "../assets/img/fPlecoptero.jpg";
                    }

                    if(this.platform.is('android') || this.platform.is('ios')){
                        this.realTricoptero = "../www/assets/img/fTricoptero.jpg";
                    }else{
                        this.realTricoptero = "../assets/img/fTricoptero.jpg";
                    }             
                }


    public move(bicho){
        let yOffset = document.getElementById(bicho).offsetTop;
        this.content.scrollTo(0, yOffset, 1000);
    }
    
    ngOnInit(){
        
    }
    ngAfterViewInit(){
        
    }

    ionViewDidLoad() {
        this.altoMapa = (this.contenedor.nativeElement.offsetHeight)-155;
    }
    
    openModal(pic,name) {
        let modal = this.modalCtrl.create(ModalPage, {foto: pic, nombre: name});
        modal.present();
    }

   takefotoPaisaje(){
       this.camaraCtrl.takePicture64().then((data) => 
       {this.fotoPaisaje = data;
       this.fotoPaisajeURL = this.fotoPaisajeURL + this.fotoPaisaje;
       this.fotoPaisajeURLSafe= this.sanitizer.bypassSecurityTrustUrl(this.fotoPaisajeURL );}); 
   }

    takefotoMuestra(){
       this.camaraCtrl.takePicture64().then((data) => 
       {this.fotoMuestra = data;
       this.fotoMuestraURL = this.fotoMuestraURL + this.fotoMuestra;
       this.fotoMuestraURLSafe= this.sanitizer.bypassSecurityTrustUrl(this.fotoMuestraURL );});
   }
    
    mostrarFoto(pic){
        let picture = 'data:image/jpeg;base64,'+pic;
        PhotoViewer.show(picture);
    }

    deleteFoto(del){
        if(del==='paisaje'){
            this.fotoPaisaje = null;
            this.fotoPaisajeURL= 'data:image/jpeg;base64,';
        }
        else{
            this.fotoMuestra = null;
            this.fotoMuestraURL= 'data:image/jpeg;base64,';
        }  
    }
        
  
   public presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Subir Imagen desde',
            buttons: [
                {
                    text: 'Libreria',
                    handler: () => {
                        this.camaraCtrl.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Camara',
                    handler: () => {
                        //this.camaraCtrl.takePicture64();
                    }
                },
                {
                    text: 'Cancelar',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    }

  
    public pasoAnterior(){
        switch(this.registro) {
                    case "fotos":
                        return this.registro = "mapa";
                    case "obseravaciones":
                        return this.registro = "fotos";
                }
    }

    public siguientePaso(){
        switch(this.registro) {
                    case "mapa":
                        return this.registro = "fotos";
                    case "fotos":
                        return this.registro = "obseravaciones";
                    case "obseravaciones":
                        this.controlDeDatos();
                }
    }

    controlDeDatos(){
        
        let elmidos = this.coincidencia.value.elmidos;
        let plecopteros = this.coincidencia.value.plecopteros;
        let tricopteros = this.coincidencia.value.tricopteros;
        let patudos = this.coincidencia.value.patudos;
        let observaciones = this.coincidencia.value.observaciones;
        
        if(this.fotoPaisaje != null && this.fotoMuestra != null){
            if(elmidos == null || plecopteros == null || tricopteros == null || patudos == null){
                let titulo = "Encuesta";
                let mensaje = "Debe seleccionar SI o NO en cada bicho."
                this.mostrarAlerta(titulo,mensaje);
            }else{
                this.localSaveCtrl.crear(this.fotoPaisaje,this.fotoMuestra,patudos,elmidos,plecopteros,tricopteros,this.latitud,this.longitud,observaciones).then((estado)=>{
                    if(estado === 1){
                        this.presentToast('Registro creado con Exito');
                        let i = this.calcularIndice(patudos,elmidos,plecopteros,tricopteros);
                        this.navCtrl.setRoot(Wheel,{indice: i});
                    }else{
                        this.presentToast(estado);
                    }
                });
            }
        }else{
            if(this.fotoPaisaje == null && this.fotoMuestra == null){
                let titulo = "Fotos no tomadas";
                let mensaje = "Por favor, tomar las fotos correspondientes para poder continuar";
                this.mostrarAlerta(titulo,mensaje);
            }else{
                if(this.fotoPaisaje == null){
                    let titulo = "Foto paisaje";
                    let mensaje = "Por favor, tomar una foto del paisaje antes de continuar";
                    this.mostrarAlerta(titulo,mensaje);
                }else{
                    if(this.fotoMuestra == null){
                        let titulo = "Foto muestra";
                        let mensaje = "Por favor, tomar una foto de la muestra antes de continuar";
                        this.mostrarAlerta(titulo,mensaje);
                    }
                }
            }
        }
    }

    public calcularIndice(patudos,elmidos,plecopteros,tricopteros){
        let i = 0;
        if(patudos === 'si'){
        i++;
        }
        if(elmidos === 'si'){
        i++;
        }
        if(plecopteros === 'si'){
        i++;
        }
        if(tricopteros === 'si'){
        i++;
        }
        return i;
    }

    mostrarAlerta(titulo,mensaje) {
        let alert = this.alertCtrl.create({
        title: titulo,
        subTitle: mensaje,
        buttons: ['ACEPTAR']
        });
        alert.present();
    }

    ubicacion(){
        let text = 'Espere mientras cargamos la ubicacion';
        this.showLoader(text);
        this.obtenerUbicacion();
    }

   public obtenerUbicacion(){
        this.ubicacionCtrl.obtenerCoordenadas().then((data) => 
        {
            if(data != -1){
                this.coordenadas = data;
                this.latitud = this.coordenadas.latitude;
                this.longitud = this.coordenadas.longitude;
                this.loading.dismiss();
            }else{
                this.obtenerUbicacion();
            }
        }); 
   }
   
   logout(){
        console.log('saliendo logout');
        this.authService.logout().then(()=>{
        console.log('listo borrado, dirijiendo a registrar');
        this.navCtrl.setRoot(LoginPage);
        });
  }

    showLoader(text){
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