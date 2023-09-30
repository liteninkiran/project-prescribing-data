import { Component, OnInit } from '@angular/core';
import { IOrganisation, IOrganisationFilters } from 'src/app/interfaces/organisation.interface';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { icon, Marker } from 'leaflet';
import { Observable } from 'rxjs';
import * as L from 'leaflet';

const blackIcon = L.icon({
    iconUrl     : 'assets/map-marker.svg',
    iconSize    : [40, 40], // size of the icon
    iconAnchor  : [20, 40], // point of the icon which will correspond to marker's location
    popupAnchor : [0, -40] // point from which the popup should open relative to the iconAnchor
});

const redIcon = L.icon({
    iconUrl     : 'assets/map-marker-red.svg',
    iconSize    : [40, 40], // size of the icon
    iconAnchor  : [20, 40], // point of the icon which will correspond to marker's location
    popupAnchor : [0, -40] // point from which the popup should open relative to the iconAnchor
});

@Component({
    selector: 'app-organisation-map',
    templateUrl: './organisation-map.component.html',
    styleUrls: ['./organisation-map.component.scss'],
    providers: [OrganisationService],
})
export class OrganisationMapComponent implements OnInit {
    public filters: IOrganisationFilters = {} as IOrganisationFilters;
    public data$!: Observable<IOrganisation[]>;
    public data!: IOrganisation[];

    // Map
    private map!: L.Map;
    private tiles!: L.TileLayer;


    constructor(
        readonly orgService: OrganisationService,
    ) { }

    public ngOnInit(): void {
        this.data$ = this.orgService.loadMapData(this.filters);
        this.data$.subscribe((res: IOrganisation[]) => {
            this.data = res;
            this.setupMap();
        });
    }

    public updateFilters(filters: any): void {
        this.filters = filters;
    }

    private setupMap() {
        this.fixLeafletBug();
        this.setMapObjects();
    }

    private setMapObjects() {
            // Co-ordinates
            const centreCoords: L.LatLngExpression = [55, -1];
            const initialZoom = 6;
            const map = L.map('map').setView(centreCoords, initialZoom);
            const tileOptions = {
                minZoom: 1,
                maxZoom: 16,
                ext: 'jpg',
            }
            const url = 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}';
            const tiles = L.tileLayer(url, tileOptions).addTo(map);
            this.data.map((org: IOrganisation) => {
                if (org.postcode?.latitude && org.postcode.longitude) {
                    const markerCoords: L.LatLngExpression = [org.postcode.latitude, org.postcode.longitude];
                    const marker = L.marker(markerCoords).addTo(map);
                }
            });
            // const onMapClick = (e: any) => map.setView(centreCoords, initialZoom);
            // map.on('click', onMapClick);
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
