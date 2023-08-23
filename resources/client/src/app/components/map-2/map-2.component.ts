import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { icon, Marker } from 'leaflet';
import * as L from 'leaflet';

const greenIcon = L.icon({
    iconUrl     : 'assets/tree.png',
    iconSize    : [32, 37], // size of the icon
    iconAnchor  : [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor : [0, -37] // point from which the popup should open relative to the iconAnchor
});

const blackIcon = L.icon({
    iconUrl     : 'assets/map-marker.svg',
    iconSize    : [40, 40], // size of the icon
    iconAnchor  : [20, 40], // point of the icon which will correspond to marker's location
    popupAnchor : [0, -40] // point from which the popup should open relative to the iconAnchor
});

@Component({
    selector: 'app-map-2',
    templateUrl: './map-2.component.html',
    styleUrls: ['./map-2.component.scss'],
    encapsulation: ViewEncapsulation.None,
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
    private zoom = 12;
    private centre = [50.794257, -1.066010];
    private centreCoords!: L.LatLngExpression;
    private otherCoords!: L.LatLngExpression;

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
        this.otherCoords = [lat + 0.005, long + 0.008];
    }

    private setupMap() {
        this.fixLeafletBug();
        this.setMapObjects();
    }

    private setMapObjects() {
        this.map = L.map('map', { zoomSnap: 0.1 }).setView(this.centreCoords, this.zoom);
        this.tiles = L.tileLayer(this.urlTemplate, this.tileLayerOptions).addTo(this.map);

        const marker1 = L.marker(this.centreCoords, { icon: blackIcon });
        const marker2 = L.marker(this.otherCoords, { icon: blackIcon });
        const marker3 = L.marker([51, -1], { icon: blackIcon });
        const featureGroup = L.featureGroup([marker1, marker2, marker3]).addTo(this.map);

        this.map.fitBounds(featureGroup.getBounds(), { padding: [40, 40] });
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
