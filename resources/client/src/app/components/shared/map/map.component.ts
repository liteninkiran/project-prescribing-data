import { Component, Input, OnInit, OnChanges, OnDestroy, AfterViewInit, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
    selector: 'shared-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

    @ViewChild('mapContainer') private mapContainer!: ElementRef;

    @Input() public data!: any[];
    @Input() public borderRadius = '';

    public featureGroup!: L.FeatureGroup<any>;

    private map!: L.Map;
    private zoom = {
        min: 5,
        max: 20,
        initial: 6,
    }
    private opacity = {
        min: 0.25,
        max: 1,
    }

    constructor(
        private router: Router,
    ) { }

    public ngOnInit(): void {

    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.clearMarkers();
        this.addMarkersToMap();
    }

    public ngOnDestroy(): void {

    }

    public ngAfterViewInit(): void {
        this.initialiseMap();
    }

    private fitBounds(): void {
        if (this.featureGroup.getLayers().length > 0) {
            this.map.fitBounds(this.featureGroup.getBounds(), { padding: [40, 40] });
        }
    }

    private initialiseMap(): void {
        this.setMap();
        this.addTileLayer();
    }

    private setMap(): void {
        if (!this.map && this.mapContainer) {
            const centreCoords: L.LatLngExpression = [55, -1];
            this.map = L.map(this.mapContainer.nativeElement);
            this.map.on('zoom', (event: L.LeafletEvent) => {
                if (this.featureGroup) {
                    const opacity = this.calculateOpacity(event.target._zoom);
                    this.featureGroup.eachLayer((layer: any) => {
                        layer.setOpacity(opacity);
                    });
                }
            });
            this.map.setView(centreCoords, this.zoom.initial);
        }
    }

    private addTileLayer(): void {
        const url = 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.{ext}';
        const tileOptions = {
            minZoom: this.zoom.min,
            maxZoom: this.zoom.max,
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
        this.fitBounds();
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
            marker.setOpacity(this.calculateOpacity(this.zoom.initial));
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

    private calculateOpacity(zoom: number): number {
        const zoomDiff = this.zoom.max - this.zoom.min;
        const opacityDiff = this.opacity.max - this.opacity.min;
        const gradient = opacityDiff / zoomDiff;
        const intercept = this.opacity.min - (gradient * this.zoom.min);
        return (gradient * zoom) + intercept;
    }
}

const defaultIcon: L.IconOptions = {
    iconUrl     : 'assets/svg/map-marker/map-marker-a.svg',
    iconSize    : [25, 25],
    iconAnchor  : [12.5, 25],
    popupAnchor : [0, -25],
}
