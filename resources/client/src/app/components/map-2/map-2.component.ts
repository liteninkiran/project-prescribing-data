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
        zoom: 13,
        center: latLng(51.505, -0.09)
    };

    constructor() {

    }

    public ngOnInit(): void {

    }

    public mapReady(map: L.Map) {
        map.addControl(L.control.zoom({ position: 'bottomright' }));

        // Reset the map
        setTimeout(() => {
              map.invalidateSize();
        }, 0);
    }
}
