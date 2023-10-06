import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
    selector: 'shared-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges {

    @Input() public data: any[] = [];

    // Map
    private map!: L.Map;
    private featureGroup!: L.FeatureGroup<any>;

    constructor(
        private router: Router,
    ) { }

    public ngOnInit(): void {
        this.initialiseMap();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.clearMarkers();
        this.addMarkersToMap();
    }

    private initialiseMap(): void {
        this.setMap();
        this.addTileLayer();
    }

    private setMap(): void {
        const centreCoords: L.LatLngExpression = [55, -1];
        const initialZoom = 6;
        if (!this.map) {
            this.map = L.map('map');
        }
        this.map.setView(centreCoords, initialZoom);
    }

    private addTileLayer(): void {
        const url = 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.{ext}';
        const tileOptions = {
            minZoom: 0,
            maxZoom: 20,
            ext: 'png',
        }
        L.tileLayer(url, tileOptions).addTo(this.map);
    }

    private addMarkersToMap(): void {
        if (this.data.length === 0) { this.setMap(); return; }
        const markers: L.Marker[] = [];
        this.data.map((point: any) => {
            const marker = this.addMarkerToMap(point);
            if (marker) { markers.push(marker); }
        });
        this.featureGroup = L.featureGroup([ ...markers ]).addTo(this.map);
        if (markers.length > 0) {
            this.map.fitBounds(this.featureGroup.getBounds(), { padding: [40, 40] });
        }
    }

    private addMarkerToMap(point: any): L.Marker | undefined {
        if (point.postcode?.latitude && point.postcode.longitude) {
            const markerCoords: L.LatLngExpression = [point.postcode.latitude, point.postcode.longitude];
            const iconOptions: L.IconOptions = point.primary_role.icon ? { ...defaultIcon, iconUrl: point.primary_role.icon } : defaultIcon;
            const markerIcon = L.icon(iconOptions);
            const markerOptions: L.MarkerOptions = { icon: markerIcon }
            const onClick = () => this.router.navigate(['organisations/' + point.org_id]);
            const tooltipText = this.getTooltipText(point);
            const tooltipOptions: L.TooltipOptions = { direction: 'top', offset: [0, -30] }
            const marker = L.marker(markerCoords, markerOptions)
                .bindTooltip(tooltipText, tooltipOptions)
                .on('click', onClick);
            return marker;
        } else {
            return undefined;
        }
    }

    private clearMarkers(): void {
        if (this.featureGroup && this.map.hasLayer(this.featureGroup)) {
            this.map.removeLayer(this.featureGroup);
        }
    }

    private getTooltipText(point: any): string {
        return `
            <h3>${point.org_id}</h3>
            <p>${point.primary_role.display_name}</p>
            <p>${point.name}</p>
            <p>${point.post_code}</p>
        `;
    }
}

const defaultIcon: L.IconOptions = {
    iconUrl     : 'assets/svg/map-marker/map-marker-a.svg',
    iconSize    : [25, 25],
    iconAnchor  : [12.5, 25],
    popupAnchor : [0, -25],
}