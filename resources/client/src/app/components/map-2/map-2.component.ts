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
    iconAnchor  : [40, 40], // point of the icon which will correspond to marker's location
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
    private geoJson: any = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "coordinates": [
                        [
                            [
                                -1.1000864607935625,
                                50.80520580844657,
                            ],
                            [
                                -1.1000864607935625,
                                50.782614672559305,
                            ],
                            [
                                -1.0673450297755949,
                                50.782614672559305,
                            ],
                            [
                                -1.0673450297755949,
                                50.80520580844657,
                            ],
                            [
                                -1.1000864607935625,
                                50.80520580844657
                            ]
                        ]
                    ],
                    "type": "Polygon",
                },
            },
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                -1.1145500337765384,
                                50.84016278020199,
                            ],
                            [
                                -1.116422049538704,
                                50.84010468977159,
                            ],
                            [
                                -1.1182760228969153,
                                50.83993097835448,
                            ],
                            [
                                -1.1200940857389257,
                                50.839643320164335,
                            ],
                            [
                                -1.1218587168368366,
                                50.83924448758177,
                            ],
                            [
                                -1.1235529110587459,
                                50.83873832437488,
                            ],
                            [
                                -1.1251603435516147,
                                50.83812970857427,
                            ],
                            [
                                -1.126665527298237,
                                50.83742450536409,
                            ],
                            [
                                -1.1280539625178923,
                                50.836629510447814,
                            ],
                            [
                                -1.1293122764621724,
                                50.83575238443993,
                            ],
                            [
                                -1.1304283522537417,
                                50.83480157892164,
                            ],
                            [
                                -1.1313914455252667,
                                50.83378625487923,
                            ],
                            [
                                -1.1321922877373067,
                                50.83271619431693,
                            ],
                            [
                                -1.1328231751862023,
                                50.831601705901775,
                            ],
                            [
                                -1.1332780428545441,
                                50.830453525555,
                            ],
                            [
                                -1.133552522406128,
                                50.82928271295204,
                            ],
                            [
                                -1.1336439837828407,
                                50.82810054493245,
                            ],
                            [
                                -1.1335515600210646,
                                50.826918406848804,
                            ],
                            [
                                -1.133276155068326,
                                50.825747682903284,
                            ],
                            [
                                -1.1328204345453772,
                                50.82459964652837,
                            ],
                            [
                                -1.132188799563142,
                                50.82348535186676,
                            ],
                            [
                                -1.131387343866314,
                                50.82241552739383,
                            ],
                            [
                                -1.1304237947344316,
                                50.82140047270386,
                            ],
                            [
                                -1.1293074382253983,
                                50.820449959449995,
                            ],
                            [
                                -1.1280490294943704,
                                50.81957313738697,
                            ],
                            [
                                -1.1266606890612951,
                                50.81877844641556,
                            ],
                            [
                                -1.1251557860319943,
                                50.81807353546982,
                            ],
                            [
                                -1.123548809399388,
                                50.817465189021675,
                            ],
                            [
                                -1.1218552286622332,
                                50.816959261904195,
                            ],
                            [
                                -1.1200913450976955,
                                50.8165606230752,
                            ],
                            [
                                -1.1182741351103869,
                                50.816273108856954,
                            ],
                            [
                                -1.1164210871534728,
                                50.81609948609729,
                            ],
                            [
                                -1.1145500337765384,
                                50.816041425602855,
                            ],
                            [
                                -1.1126789803996038,
                                50.81609948609729,
                            ],
                            [
                                -1.11082593244269,
                                50.816273108856954,
                            ],
                            [
                                -1.1090087224553813,
                                50.8165606230752,
                            ],
                            [
                                -1.1072448388908436,
                                50.816959261904195,
                            ],
                            [
                                -1.1055512581536886,
                                50.817465189021675,
                            ],
                            [
                                -1.1039442815210825,
                                50.81807353546982,
                            ],
                            [
                                -1.1024393784917816,
                                50.81877844641556,
                            ],
                            [
                                -1.1010510380587064,
                                50.81957313738697,
                            ],
                            [
                                -1.0997926293276785,
                                50.820449959449995,
                            ],
                            [
                                -1.0986762728186452,
                                50.82140047270386,
                            ],
                            [
                                -1.0977127236867628,
                                50.82241552739383,
                            ],
                            [
                                -1.0969112679899349,
                                50.82348535186676,
                            ],
                            [
                                -1.0962796330076994,
                                50.82459964652837,
                            ],
                            [
                                -1.095823912484751,
                                50.825747682903284,
                            ],
                            [
                                -1.0955485075320122,
                                50.826918406848804,
                            ],
                            [
                                -1.095456083770236,
                                50.82810054493245,
                            ],
                            [
                                -1.0955475451469487,
                                50.82928271295204,
                            ],
                            [
                                -1.0958220246985328,
                                50.830453525555,
                            ],
                            [
                                -1.0962768923668744,
                                50.831601705901775,
                            ],
                            [
                                -1.09690777981577,
                                50.83271619431693,
                            ],
                            [
                                -1.09770862202781,
                                50.83378625487923,
                            ],
                            [
                                -1.0986717152993353,
                                50.83480157892164,
                            ],
                            [
                                -1.0997877910909046,
                                50.83575238443993,
                            ],
                            [
                                -1.1010461050351845,
                                50.836629510447814,
                            ],
                            [
                                -1.1024345402548397,
                                50.83742450536409,
                            ],
                            [
                                -1.1039397240014621,
                                50.83812970857427,
                            ],
                            [
                                -1.1055471564943309,
                                50.83873832437488,
                            ],
                            [
                                -1.1072413507162402,
                                50.83924448758177,
                            ],
                            [
                                -1.109005981814151,
                                50.839643320164335,
                            ],
                            [
                                -1.1108240446561615,
                                50.83993097835448,
                            ],
                            [
                                -1.1126780180143725,
                                50.84010468977159,
                            ],
                            [
                                -1.1145500337765384,
                                50.84016278020199,
                            ],
                        ],
                    ],
                },
            },
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "coordinates": [
                        -1.0617268292859876,
                        50.82200131541447,
                    ],
                    "type": "Point",
                },
            },
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "coordinates": [
                        -1.0254779642356198,
                        50.80858571815577,
                    ],
                    "type": "Point",
                },
            },
        ],
    }

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
    }

    private setupMap() {
        this.fixLeafletBug();
        this.setMapObjects();
    }

    private setMapObjects() {
        this.map = L.map('map').setView(this.centreCoords, this.zoom);
        this.tiles = L.tileLayer(this.urlTemplate, this.tileLayerOptions).addTo(this.map);
        L.geoJSON(this.geoJson, {
            style: function(feature) {
                return {
                    color: '#000',
                    weight: 0.5,
                };
            },
            pointToLayer: function(geoJsonPoint, latlng) {
                return L.marker(latlng, { icon: blackIcon });
            },
            onEachFeature: function(feature, layer) {
                if (feature.geometry.type === 'Point') {
                    layer.bindPopup(feature.geometry.coordinates.join(', '));
                }
            },
        }).addTo(this.map);
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
