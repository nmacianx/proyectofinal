import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule} from '@angular/http';
import { MyApp } from './app.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';

//Pages
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ListaRegistrosPage } from '../pages/lista-registros/lista-registros';
import { PopoverPage } from '../pages/lista-registros/popOver';
import { ListaUsuariosPage } from '../pages/lista-usuarios/lista-usuarios';

//Providers
import { Auth } from '../providers/auth';
import { RegistrosService } from '../providers/registrosService';
import { Ubicacion } from '../providers/ubicacion';
import { UsuariosService } from '../providers/usuariosService';

@NgModule({
  declarations: [
    MyApp,
    DashboardPage,
    ListaRegistrosPage,
    PopoverPage,
    ListaUsuariosPage
  ],
  imports: [
    BrowserModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    MatTableModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DashboardPage,
    PopoverPage,
    ListaRegistrosPage,
    ListaUsuariosPage 
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsuariosService,
    Ubicacion,
    RegistrosService,
    Auth
  ]
})
export class AppModule {}
