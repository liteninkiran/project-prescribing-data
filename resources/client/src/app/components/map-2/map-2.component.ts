import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer } from 'leaflet';
import * as L from 'leaflet';

@Component({
    selector: 'app-map-2',
    templateUrl: './map-2.component.html',
    styleUrls: ['./map-2.component.scss'],
})
export class Map2Component implements OnInit {

    options = {
        layers: [
            tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
        ],
        zoom: 5,
        center: latLng(46.879966, -121.726909)
    };

    constructor() {

    }

    public ngOnInit(): void {
        const myMap = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(myMap);
    }

    
}
