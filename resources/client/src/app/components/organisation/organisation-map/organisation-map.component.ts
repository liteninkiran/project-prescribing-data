import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IOrganisation, IOrganisationFilters, IOrganisationMapResponse } from 'src/app/interfaces/organisation.interface';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { icon, Marker } from 'leaflet';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import * as L from 'leaflet';

@Component({
    selector: 'app-organisation-map',
    templateUrl: './organisation-map.component.html',
    styleUrls: ['./organisation-map.component.scss'],
    providers: [OrganisationService, DecimalPipe],
})
export class OrganisationMapComponent implements OnInit {
    public filters: IOrganisationFilters = {} as IOrganisationFilters;
    public defaultFilters: IOrganisationFilters = { status: 0 } as IOrganisationFilters;
    public data$!: Observable<IOrganisationMapResponse>;
    public data!: IOrganisation[];
    public message: string = '';

    // Map
    private map!: L.Map;
    private featureGroup!: L.FeatureGroup<any>;

    constructor(
        readonly orgService: OrganisationService,
        private _decimalPipe: DecimalPipe,
        private router: Router,
    ) { }

    public ngOnInit(): void {
        this.initialiseMap();
    }

    public loadData(): void {
        this.data$ = this.orgService.loadMapData(this.filters);
        this.data$.subscribe((res: IOrganisationMapResponse) => {
            this.data = res.data;
            this.setFilterMessage(res.total, res.limit, res.limit_exceeded);
            this.clearMarkers();
            this.addMarkersToMap();
        });
    }

    public updateFilters(filters: any): void {
        this.filters = filters;
        this.loadData();
    }

    private initialiseMap(): void {
        this.setMap();
        this.addTileLayer();
    }

    private setMap(): void {
        const centreCoords: L.LatLngExpression = [55, -1];
        const initialZoom = 6;
        if (this.map) {
            this.map.setView(centreCoords, initialZoom);
        } else {
            this.map = L.map('map').setView(centreCoords, initialZoom);
        }
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

    private fixLeafletBug(): void {
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

    private setFilterMessage(total: number, limit: number, limit_exceeded: boolean): void {
        const totalStr = this._decimalPipe.transform(total, '1.0-0');
        const limitStr = this._decimalPipe.transform(limit, '1.0-0');
        const warning = '<strong>Please restrict your query using the filters</strong>';
        this.message = 'Showing ';
        if (limit_exceeded) {
            this.message += limitStr + ' of ' + totalStr + ' items ' + warning;
        } else {
            this.message += totalStr + ' items';
        }
    }
}

const defaultIcon: L.IconOptions = {
    iconUrl     : 'assets/svg/map-marker/map-marker-a.svg',
    iconSize    : [25, 25],
    iconAnchor  : [12.5, 25],
    popupAnchor : [0, -25],
}
