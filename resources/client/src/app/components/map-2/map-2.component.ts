import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer } from 'leaflet';
import * as L from 'leaflet';

@Component({
    selector: 'app-map-2',
    templateUrl: './map-2.component.html',
    styleUrls: ['./map-2.component.scss'],
})
export class Map2Component implements OnInit {

    private urlTemplate: string = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    private zoom = 13;
    private tileLayerOptions: L.TileLayerOptions = {
        maxZoom: 18,
        attribution: '...',
    };
    private currentPosition = {
        lat: 51.505,
        long: -0.09,
    };

    public options = {
        layers: [ tileLayer(this.urlTemplate, this.tileLayerOptions) ],
        zoom: this.zoom,
        center: latLng(this.currentPosition.lat, this.currentPosition.long),
    };

    constructor() {

    }

    public ngOnInit(): void {
        navigator.geolocation.getCurrentPosition((position) => this.currentPosition = {
            lat: position.coords.latitude,
            long: position.coords.longitude,
        });
    }
}
