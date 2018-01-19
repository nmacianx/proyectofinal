import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Ubicacion } from '../../providers/ubicacion';
import { ConnectivityService } from '../../providers/connectivityService';
import { ArgumentType } from '@angular/core/src/view';

declare var google;
declare var MarkerClusterer;
var clusterPintados = new Array();
var cityCircle;

@Component({
    selector: 'page-mapa-general',
    templateUrl: 'mapa-general.html'
})
export class MapaGeneralPage {
    markers: any;
    mapInitialised: boolean = false;
    apiKey: any = 'AIzaSyA4h0qNqE_K6GuDT5-BH2g2Mx_XcwbLSys';


    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public connectivityService: ConnectivityService,
        public ubicacionCtrl: Ubicacion) {
    }

    ionViewDidLoad() {
        this.loadGoogleMaps();
    }

    public loadGoogleMaps() {
        this.addConnectivityListeners();
        if (typeof google == "undefined" || typeof google.maps == "undefined") {

            console.log("Google maps JavaScript necesita ser cargado.");
            this.disableMap();

            if (this.connectivityService.isOnline()) {
                console.log("online, loading map");

                //Load the SDK
                window['mapInit'] = () => {
                    this.initMap();
                    this.enableMap();
                }

                let script = document.createElement("script");
                let script2 = document.createElement("script");
                script.id = "googleMaps";

                if (this.apiKey) {
                    script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
                } else {
                    script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
                }

                document.body.appendChild(script);
                script2.id = "markerclusterer";
                script2.src = "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js";
                document.body.appendChild(script2);
            }
        }
        else {

            if (this.connectivityService.isOnline()) {
                console.log("showing map");
                this.initMap();
                this.enableMap();
            }
            else {
                console.log("disabling map");
                this.disableMap();
            }

        }
    }



    public addConnectivityListeners() {

        let onOnline = () => {

            setTimeout(() => {
                if (typeof google == "undefined" || typeof google.maps == "undefined") {

                    this.loadGoogleMaps();

                } else {

                    if (!this.mapInitialised) {
                        this.initMap();
                    }

                    this.enableMap();
                }
            }, 2000);

        };

        let onOffline = () => {
            this.disableMap();
        };

        document.addEventListener('online', onOnline, false);
        document.addEventListener('offline', onOffline, false);

    }


    disableMap() {
        console.log("disable map");
    }

    enableMap() {
        console.log("enable map");
    }

    // 

    initMap() {


        google.maps.Map.prototype.getMapScale = function (opt) {
            var circumference = 40075040,
                zoom, lat, scale;

            if (typeof (opt['zoom']) == 'number' && typeof (opt['lat']) == 'number') {
                zoom = opt['zoom'];
                lat = opt['lat'];
            } else {
                zoom = this.getZoom();
                lat = this.getCenter().lat();
            }

            scale = (circumference * Math.cos(lat) / Math.pow(2, zoom + 8));

            if (typeof (opt['precision']) == 'number') {
                scale = Number(scale.toFixed(opt['precision']));
            }

            return scale;
        }

        //Una vez iniciado el mapa, obtengo las coordenadas de mis registros.
        this.ubicacionCtrl.obtenerTodasLasCoordenadas().then((resultado) => {
            this.markers = resultado;
            console.log('mis marcadores', this.markers)
            //Declaro la variable map, de google, no defino Zoom, ni la poscion de centrado
            //ya que se auto calcula, mas adelante, con bounds
            var map = new google.maps.Map(document.getElementById('map'), {
                //zoom: 5,
                //center: { lat: -28.024, lng: 140.887 }
                scrollwheel: false,
                navigationControl: false,
                mapTypeControl: false,
                scaleControl: false,
                draggable: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            // Clase que me permite agregar el PopUp para ver la informacion
            var infowindow = new google.maps.InfoWindow();

            //Me ayuda a que el mapa este siempre centrado, con respecto a todos los puntos 
            // que tengo en mi mapa, osea que siempre tengo visible todos los puntos
            // de mi mapa
            var bounds = new google.maps.LatLngBounds();

            var marcadores = [];
            var arryPosiciones = [];
            var i;

            for (let m of this.markers) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(m.latitud, m.longitud),
                    map: map,
                    idRegistro: m.idRegistro
                });

                marcadores.push(marker);

                arryPosiciones.push(marker.position);

                bounds.extend(marker.position);

                google.maps.event.addListener(marker, 'click', (function (marker) {
                    var content = '<div><img src="data:image/jpeg;base64,' + m.fotoPaisaje + '">' + m.idRegistro + '</div>';
                    return function () {
                        infowindow.setContent(content);
                        infowindow.open(map, marker);
                    }
                })(marker));
            }


            //definimos la línea
            var linea = new google.maps.Polyline({
                path: arryPosiciones,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            //dibujamos la línea sobre el mapa
            //linea.setMap(map);


            // La opcion de cluster, lo que me hace es mediante IA, agrupar todos los puntos cercanos.
            var clusterOptions = {
                zoomOnClick: false,
                averageCenter: true,
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            }

            var markerCluster = new MarkerClusterer(map, marcadores, clusterOptions);

            //Agrego el evento click al cluster.
            google.maps.event.addListener(markerCluster, 'clusterclick', function (cluster) {
                var markers = cluster.getMarkers();
                var array = [];
                var num = 0;
                let radio = 0;
                for (i = 0; i < markers.length; i++) {
                    num++;
                    array.push(markers[i].idRegistro + '<br>');
                    let radioTemp = google.maps.geometry.spherical.computeDistanceBetween(markers[i].position, cluster.getCenter());
                    (radio < radioTemp) ? radio = radioTemp : '';
                }
                infowindow.setContent(markers.length + " markers<br>" + array);
                infowindow.setPosition(cluster.getCenter());
                infowindow.open(map);
                let latlong = cluster.getCenter().lat() + '' + cluster.getCenter().lng();
                let index = clusterPintados.indexOf(latlong);
                if (index === -1) {
                    clusterPintados.push(latlong);
                        cityCircle = new google.maps.Circle({
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        fillOpacity: 0.35,
                        map: map,
                        center: cluster.getCenter(),
                        radius: radio
                    });
                    console.log('agregado')
                }else{
                    clusterPintados.splice(index,1);
                }
                console.log(clusterPintados)

            });

            //Termino de centrar el mapa
            map.fitBounds(bounds);
        });
    }

    borrarCirculos(){
        cityCircle.setMap(null);
    }

}



