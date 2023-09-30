import { Component, OnInit } from '@angular/core';
import { IOrganisation, IOrganisationFilters, IOrganisationMapResponse } from 'src/app/interfaces/organisation.interface';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { icon, Marker } from 'leaflet';
import { Observable } from 'rxjs';
import * as L from 'leaflet';

@Component({
    selector: 'app-organisation-map',
    templateUrl: './organisation-map.component.html',
    styleUrls: ['./organisation-map.component.scss'],
    providers: [OrganisationService],
})
export class OrganisationMapComponent implements OnInit {
    public filters: IOrganisationFilters = {} as IOrganisationFilters;
    public data$!: Observable<IOrganisationMapResponse>;
    public data!: IOrganisation[];
    public message: string = '';

    // Map
    private map!: L.Map;
    private featureGroup!: L.FeatureGroup<any>;

    constructor(
        readonly orgService: OrganisationService,
    ) { }

    public ngOnInit(): void {
        this.initialiseMap();
        this.loadData();
    }

    public loadData() {
        this.data$ = this.orgService.loadMapData(this.filters);
        this.data$.subscribe((res: IOrganisationMapResponse) => {
            this.data = res.data;
            this.message = 'Showing ' + this.data.length + ' items' + (res.limit_exceeded ? '. Limit exceeded. Please restrict your query using the filters.' : '');
            this.clearMarkers();
            this.addMarkersToMap();
        });
    }

    public updateFilters(filters: any): void {
        this.filters = filters;
        this.loadData();
    }

    private initialiseMap() {
        this.fixLeafletBug();
        this.setMap();
    }

    private setMap() {
        const centreCoords: L.LatLngExpression = [55, -1];
        const initialZoom = 6;
        const url = 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}';
        const tileOptions = {
            minZoom: 1,
            maxZoom: 16,
            ext: 'jpg',
        }
        this.map = L.map('map').setView(centreCoords, initialZoom);
        L.tileLayer(url, tileOptions).addTo(this.map);
    }

    private addMarkersToMap() {
        const markers: L.Marker[] = [];

        this.data.map((org: IOrganisation) => {
            if (org.postcode?.latitude && org.postcode.longitude) {
                const markerCoords: L.LatLngExpression = [org.postcode.latitude, org.postcode.longitude];
                const marker = L.marker(markerCoords);
                markers.push(marker);
            }
        });

        this.featureGroup = L.featureGroup([ ...markers ]).addTo(this.map);
        this.map.fitBounds(this.featureGroup.getBounds(), { padding: [40, 40] });



        // const onMapClick = (e: any) => map.setView(centreCoords, initialZoom);
        // map.on('click', onMapClick);
    }

    public clearMarkers() {
        if (this.featureGroup && this.map.hasLayer(this.featureGroup)) {
            this.map.removeLayer(this.featureGroup);
        }
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
