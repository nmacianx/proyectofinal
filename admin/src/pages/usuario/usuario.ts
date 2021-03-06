import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { AlertController, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { UsuariosService } from '../../providers/usuariosService';
import { Storage } from '@ionic/storage';
import { ListaRegistrosPageUsuario } from '../lista-registros-usuario/lista-registros-usuario';
import { ListaRegistrosPage } from '../lista-registros/lista-registros';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'page-usuario',
  templateUrl: 'usuario.html'
})
export class UsuarioPage {

  loading: any;
  public usuario: any;
  editar: boolean = false;
  margen: number = 275;
  nombre: any;
  apellido: any;
  residencia: any;
  institucion: any;
  grado: any;
  infoUsuarios: any;
  formularioUsuario: any;
  submitAttempt: boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef;
  @Input() idUsuario: any;
  idUsuarioConsultaRegistros: any;
  @Output() idRegistro: EventEmitter<any> = new EventEmitter();
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  isAdmin: boolean = true;

  constructor(public navCtrl: NavController,
    public params: NavParams,
    public userService: UsuariosService,
    public storage: Storage,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
  ) {
    this.infoUsuarios = 'info';

    this.formularioUsuario = formBuilder.group({
      nombre: ['', Validators.compose([Validators.required])],
      apellido: ['', Validators.compose([Validators.required])],
      residencia: ['', Validators.compose([Validators.required])],
      institucion: ['', Validators.compose([Validators.required])],
      grado: ['', Validators.compose([Validators.required])],
    });

  }

  ngOnChanges() {
    if (this.idUsuario > 0) {
      this.dameId();
      this.idUsuarioConsultaRegistros = this.idUsuario;
    }
  }

  llamarAlInput() {
    this.fileInput.nativeElement.click()
  }

  subirImagen(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      if ((fileInput.target.files[0].size / 1024) > 500) {
        this.mostrarAlerta('La imagen debe ser menor a 500KB', 'Error')
      } else {
        reader.readAsDataURL(fileInput.target.files[0]);
        reader.onload = ((e) => {
          let fotoPerfil = e.target['result'].split(",")[1];
          let user = {
            idUsuario: this.idUsuario,
            fotoPerfil
          }
          this.userService.actilizarFotoPerfil(user).then(res => {
            this.usuario.fotoPerfil = fotoPerfil;
          }).catch(err => this.mostrarAlerta(err, 'Error'))
        });
      }
    }
  }

  dameId() {
    this.showLoader();
    this.userService.usuarioDame(this.idUsuario)
      .then(data => {
        this.usuario = data;
        this.usuario = this.usuario[0];
        this.formularioUsuario.controls['nombre'].setValue(this.usuario.nombre);
        this.formularioUsuario.controls['apellido'].setValue(this.usuario.apellido);
        this.formularioUsuario.controls['residencia'].setValue(this.usuario.residencia);
        this.formularioUsuario.controls['institucion'].setValue(this.usuario.institucion);
        this.formularioUsuario.controls['grado'].setValue(this.usuario.grado);
        this.isAdmin = (this.usuario.rol == 'administrador') ? true : false;
        console.log(this.usuario)
        this.loading.dismiss();
      }).catch((err) => {
        this.loading.dismiss(),
          this.mostrarAlerta("No se puede conectar con el servidor", err);
      });
  }

  botonEditar() {
    //guardo el estado actual de los parametros posibles a modificar
    this.nombre = this.formularioUsuario.controls.nombre.value;
    this.apellido = this.formularioUsuario.controls.apellido.value;
    this.residencia = this.formularioUsuario.controls.residencia.value;
    this.institucion = this.formularioUsuario.controls.institucion.value;
    this.grado = this.formularioUsuario.controls.grado.value;
    //variables para modificar el DOM CSS
    this.editar = !this.editar;
  }

  botonAceptar() {
    this.usuario.nombre = this.formularioUsuario.controls.nombre.value;
    this.usuario.apellido = this.formularioUsuario.controls.apellido.value;
    this.usuario.residencia = this.formularioUsuario.controls.residencia.value;
    this.usuario.institucion = this.formularioUsuario.controls.institucion.value;
    this.usuario.grado = this.formularioUsuario.controls.grado.value;

    this.userService.usuarioModificar(this.usuario)
      .then(data => {
        let mensajeModificar = data;
        console.log(mensajeModificar)
        if (mensajeModificar[0].codigo > 0) {
          let titulo = "Correcto";
          let mensaje = mensajeModificar[0].mensaje;
          this.mostrarAlerta(mensaje, titulo);
          this.editar = !this.editar;
        } else {
          let titulo = "Error";
          let mensaje = mensajeModificar[0].mensaje;
          this.mostrarAlerta(mensaje, titulo);
        }

      }).catch((err) => {
        this.mostrarAlerta("No se puede conectar con el servidor", err)
      });
  }

  botonCancelar() {
    this.formularioUsuario.controls['nombre'].setValue(this.nombre);
    this.formularioUsuario.controls['apellido'].setValue(this.apellido);
    this.formularioUsuario.controls['residencia'].setValue(this.residencia);
    this.formularioUsuario.controls['institucion'].setValue(this.institucion);
    this.formularioUsuario.controls['grado'].setValue(this.grado);
    this.editar = !this.editar;
  }


  mostrarAlerta(mensaje, titulo) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      buttons: ['ACEPTAR']
    });
    alert.present();
  }

  async setearAdministrador() {
    this.showLoader();
    let idAdmin = await this.storage.get('idUsuario');
    let ids = {
      idAdmin,
      idUsuario: this.idUsuario
    }
    this.userService.setearAdmin(ids).then((res) => {
      this.loading.dismiss();
      this.presentToast(res[0].mensaje);
    })
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4500,
      position: 'top'
    });
    toast.present();
  }

  botonAlta() {
    let titulo = 'Activar Usuario';
    let mensaje = '¿Está seguro que desea activar al usuario ' + this.usuario.usuario.toUpperCase() + '?';
    let accion = 'activar';
    this.confirmarAlerta(titulo, mensaje, accion)
  }

  botonBaja() {
    let titulo = 'Desactivar Usuario';
    let mensaje = '¿Está seguro que desea desactivar al usuario ' + this.usuario.usuario.toUpperCase() + '?';
    this.confirmarAlerta(titulo, mensaje)
  }


  confirmarAlerta(titulo, mensaje, accion = '') {
    let confirm = this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            (accion === 'activar') ? this.activar() : this.eliminar();
          }
        }
      ]
    });
    confirm.present();
  }

  activar() {
    console.log(this.idUsuario);
    this.showLoader();
    this.userService.usuarioActivar(this.usuario.idUsuario)
      .then((res: any) => {
        this.loading.dismiss();
        if (res.codigo !== 0) {
          this.presentToast(res.mensaje);
          this.refresh.emit('ok');
        }
      }).catch((err) => {
        this.loading.dismiss();
        this.mostrarAlerta("No se puede conectar con el servidor", err)
      });
  }

  eliminar() {
    console.log(this.idUsuario);
    this.showLoader();
    this.userService.usuarioBaja(this.usuario.idUsuario)
      .then((res: any) => {
        console.log('TCL: UsuarioPage -> eliminar -> res', res);
        this.loading.dismiss();
        if (res.codigo !== 0) {
          this.presentToast(res.mensaje);
          this.refresh.emit('ok');
        }
      }).catch((err) => {
        this.loading.dismiss();
        this.mostrarAlerta("No se puede conectar con el servidor", err)
      });
  }

  showLoader() {
    console.log("llamando a loading");
    this.loading = this.loadingCtrl.create({
      content: "Cargando usuario. Espere por favor..."
    });
    this.loading.present();
  }

  actualizar() {
    if (!this.formularioUsuario.valid) {
      console.log("formulario invalido");
      this.submitAttempt = true;
    } else {
      this.botonAceptar();
    }
  }

  verRegistro(id) {
    this.idRegistro.emit(id);
  }

}