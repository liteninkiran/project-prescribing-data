import { Component, OnInit } from '@angular/core';
import { icon, Marker } from 'leaflet';
import * as L from 'leaflet';

@Component({
    selector: 'app-map-2',
    templateUrl: './map-2.component.html',
    styleUrls: ['./map-2.component.scss'],
})
export class Map2Component implements OnInit {
    // Map
    private map!: L.Map;
    private tiles!: L.TileLayer;
    private urlTemplate: string = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    private tileLayerOptions: L.TileLayerOptions = {
        maxZoom: 20,
        attribution: '...',
    };
    private zoom = 13;
    private centre = [50.7993, -1.0658];
    private centreCoords!: L.LatLngExpression;

    // Marker
    private marker!: L.Marker;
    private markerCoords!: L.LatLngExpression;
    private markerPopupContent: L.Content | ((layer: L.Layer) => L.Content) | L.Popup = '<b>Hello world!</b><br />I am a popup.';

    // Circle
    private circle!: L.Circle;
    private circleCoords!: L.LatLngExpression;
    private circlePopupContent: L.Content | ((layer: L.Layer) => L.Content) | L.Popup = 'I am a circle.';
    private circleOptions: L.CircleMarkerOptions = {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500,
    };

    // Popup
    private popup!: L.Popup;
    private popupCoords!: L.LatLngExpression;
    private popupPopupContent: ((source: L.Layer) => L.Content) | L.Content = 'I am a standalone popup.';

    // Polygon
    private polygon!: L.Polygon;
    private polygonPopupContent: L.Content | ((layer: L.Layer) => L.Content) | L.Popup = 'I am a polygon.';
    private polygonCoords!: L.LatLngExpression[];

    // User location
    private getUserLocation = async (): Promise<GeolocationPosition> => {
        return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition(res, rej);
        });
    };
    private userLocation!: GeolocationPosition;

    constructor() {
    }

    public ngOnInit(): void {
        this.setLocation();
        this.setCordinates(this.centre[0], this.centre[1]);
        this.setupMap();
    }

    private async setLocation(setMap = false): Promise<void> {
        if (!this.userLocation) {
            this.userLocation = await this.getUserLocation();
            if (setMap) {
                this.setCordinates(this.userLocation.coords.latitude, this.userLocation.coords.longitude);
                this.setupMap();
            }
        }
    }

    private setCordinates(lat: number, long: number) {
        this.centreCoords = [lat, long];
        this.markerCoords = [lat - 0.005, long];
        this.circleCoords = [lat - 0.005, long - 0.021];
        this.popupCoords = [lat + 0.008, long];
        this.polygonCoords = [
            [lat + 0.004, long + 0.004],
            [lat + 0.004, long + 0.028],
            [lat + 0.015, long + 0.028],
            [lat + 0.015, long + 0.004],
        ];
    }

    private setupMap() {
        this.fixLeafletBug();
        this.setMapObjects();
    }

    private setMapObjects() {
        this.map = L.map('map').setView(this.centreCoords, this.zoom);
        this.tiles = L.tileLayer(this.urlTemplate, this.tileLayerOptions).addTo(this.map);
        this.marker = L.marker(this.markerCoords).addTo(this.map).bindPopup(this.markerPopupContent);
        this.circle = L.circle(this.circleCoords, this.circleOptions).addTo(this.map).bindPopup(this.circlePopupContent);
        this.polygon = L.polygon(this.polygonCoords).addTo(this.map).bindPopup(this.polygonPopupContent);
        this.popup = L.popup().setLatLng(this.popupCoords).setContent(this.popupPopupContent);
        this.map.on('click', (e: L.LeafletMouseEvent) => {
            this.popup
                .setLatLng(e.latlng)
                .setContent(`You clicked the map at ${e.latlng.toString()}`)
                .openOn(this.map);
        });
    }

    private fixLeafletBug() {
        const iconRetinaUrl = 'assets/marker-icon-2x.png';
        const iconUrl = 'assets/marker-icon.png';
        const shadowUrl = 'assets/marker-shadow.png';
        const iconDefault = icon({
            iconRetinaUrl,
            iconUrl,
            shadowUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41],
        });
        Marker.prototype.options.icon = iconDefault;
    }
}
