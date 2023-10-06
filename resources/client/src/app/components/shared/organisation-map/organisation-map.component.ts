import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IOrganisation } from 'src/app/interfaces/organisation.interface';
import * as L from 'leaflet';

@Component({
    selector: 'shared-organisation-map',
    templateUrl: './organisation-map.component.html',
    styleUrls: ['./organisation-map.component.scss'],
})
export class OrganisationMapComponent implements OnInit {

    @Input() public data: IOrganisation[] = [];

    // Map
    private map!: L.Map;
    private featureGroup!: L.FeatureGroup<any>;

    constructor(
        private router: Router,
    ) { }

    public ngOnInit(): void {
        this.initialiseMap();
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
        this.data.map((org: IOrganisation) => {
            const marker = this.addMarkerToMap(org);
            if (marker) { markers.push(marker); }
        });
        this.featureGroup = L.featureGroup([ ...markers ]).addTo(this.map);
        this.map.fitBounds(this.featureGroup.getBounds(), { padding: [40, 40] });
    }

    private addMarkerToMap(org: IOrganisation): L.Marker | undefined {
        if (org.postcode?.latitude && org.postcode.longitude) {
            const markerCoords: L.LatLngExpression = [org.postcode.latitude, org.postcode.longitude];
            const iconOptions: L.IconOptions = org.primary_role.icon ? { ...defaultIcon, iconUrl: org.primary_role.icon } : defaultIcon;
            const markerIcon = L.icon(iconOptions);
            const markerOptions: L.MarkerOptions = { icon: markerIcon }
            const onClick = () => this.router.navigate(['organisations/' + org.org_id]);
            const tooltipText = this.getTooltipText(org);
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

    private getTooltipText(org: IOrganisation): string {
        return `
            <h3>${org.org_id}</h3>
            <p>${org.primary_role.display_name}</p>
            <p>${org.name}</p>
            <p>${org.post_code}</p>
        `;
    }
}

const defaultIcon: L.IconOptions = {
    iconUrl     : 'assets/svg/map-marker/map-marker-a.svg',
    iconSize    : [25, 25],
    iconAnchor  : [12.5, 25],
    popupAnchor : [0, -25],
}
