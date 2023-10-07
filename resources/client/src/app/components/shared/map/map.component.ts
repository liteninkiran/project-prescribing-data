import { Component, Input, OnInit, OnChanges, OnDestroy, AfterViewInit, SimpleChanges, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
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
    @Input() public opacityOverride: number | null = null;
    @Input() public zoomOverride!: number;

    @Output() public opacityChanged = new EventEmitter<number>();

    public featureGroup!: L.FeatureGroup<any>;

    private map!: L.Map;
    public zoom = {
        min: 6,
        max: 20,
        initial: 6,
    }
    private opacity = {
        min: 0.25,
        max: 1,
        value: 0,
    }

    constructor(
        private router: Router,
    ) { }

    public ngOnInit(): void {
        this.calculateOpacity(this.zoom.initial);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const keys = Object.keys(changes);

        if (keys.find(key => key === 'data')) {
            this.clearMarkers();
            this.addMarkersToMap();
        }

        if (keys.find(key => key === 'opacityOverride' && this.map)) {
            this.changeMarkersOpacity(this.map.getZoom());
        }
    }

    public ngOnDestroy(): void {

    }

    public ngAfterViewInit(): void {
        this.initialiseMap();
    }

    private fitBounds(): void {
        if (this.featureGroup.getLayers().length > 0) {
            this.map.fitBounds(this.featureGroup.getBounds(), { padding: [40, 40] });
            if (this.zoomOverride) {
                this.map.setView(this.map.getCenter(), this.zoomOverride);
            }
        }
    }

    private initialiseMap(): void {
        this.setMap();
        this.addTileLayer();
    }

    private onMapZoom = (event: L.LeafletEvent): void => {
        this.changeMarkersOpacity(event.target._zoom);
    }

    private changeMarkersOpacity(zoom: number): void {
        if (this.featureGroup) {
            this.calculateOpacity(zoom);
            this.opacityChanged.emit(Math.round((this.opacity.value + Number.EPSILON) * 100));
            this.featureGroup.eachLayer((layer: any) => {
                layer.setOpacity(this.opacityOverride || this.opacity.value);
            });
        }
    }

    private setMap(): void {
        if (!this.map && this.mapContainer) {
            const centreCoords: L.LatLngExpression = [55, -1];
            this.map = L.map(this.mapContainer.nativeElement);
            this.map.on('zoom', this.onMapZoom);
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
        if (!this.data || this.data.length === 0) { this.setMap(); return; }
        const markers: L.Marker[] = [];
        this.data.map((point: any) => {
            const marker = this.addMarkerToMap(point, this.opacity.value);
            if (marker) { markers.push(marker); }
        });
        this.featureGroup = L.featureGroup([ ...markers ]).addTo(this.map);
        this.fitBounds();
    }

    private addMarkerToMap(point: any, opacity: number): L.Marker | undefined {
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
            marker.setOpacity(opacity);
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

    private calculateOpacity(zoom: number): void {
        const zoomDiff = this.zoom.max - this.zoom.min;
        const opacityDiff = this.opacity.max - this.opacity.min;
        const gradient = opacityDiff / zoomDiff;
        const intercept = this.opacity.min - (gradient * this.zoom.min);
        this.opacity.value = (gradient * zoom) + intercept;
    }
}

const defaultIcon: L.IconOptions = {
    iconUrl     : 'assets/svg/map-marker/map-marker-a.svg',
    iconSize    : [25, 25],
    iconAnchor  : [12.5, 25],
    popupAnchor : [0, -25],
}
