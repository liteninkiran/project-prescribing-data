import { Component, ElementRef, Input, OnInit, AfterViewInit, OnChanges, ViewChild, SimpleChanges } from '@angular/core';
import { IMapData } from 'src/app/interfaces/shared.interface';
import * as L from 'leaflet';

@Component({
    selector: 'shared-controllable-map',
    templateUrl: './controllable-map.component.html',
    styleUrls: ['./controllable-map.component.scss'],
})
export class ControllableMapComponent implements OnInit, AfterViewInit, OnChanges {

    @ViewChild('mapContainer') private mapContainer!: ElementRef;

    @Input() public data: IMapData[] | undefined;
    @Input() public mapOptions: L.MapOptions = {}
    @Input() public initialCentreCoords: L.LatLngExpression = [54.5, -4];
    @Input() public zoom = {
        min: 5,
        max: 20,
        initial: 6,
    }

    public currentOpacityLevel: number = 1;
    public currentZoomLevel: number = this.zoom.initial;
    public zoomProgress: number = (this.zoom.initial - this.zoom.min) / (this.zoom.max - this.zoom.min) * 100;
    public currentCentre!: L.LatLng;

    private map!: L.Map;
    private featureGroup!: L.FeatureGroup<any>;
    private opacity = {
        min: 0.25,
        max: 1,
    }

    constructor(

    ) { }

    public ngOnInit(): void {
        this.setOpacity();
    }

    public ngAfterViewInit(): void {
        this.initialiseMap();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const keys = Object.keys(changes);
        if (keys.find(key => key === 'data') && this.data) {
            this.populateMap();
        }
    }

    public resetMap(): void {
        this.fitBounds();
    }

    private initialiseMap(): void {
        this.setMap();
        this.addTileLayer();
    }

    private populateMap(): void {
        this.clearMarkers();
        this.addMarkersToMap();
        this.fitBounds();
    }

    private setMap(): void {
        this.map = L.map(this.mapContainer.nativeElement, this.mapOptions);
        this.map.on('zoom', this.onMapZoom);
        this.map.on('move', this.onMapMove);
    }

    private onMapZoom = (event: L.LeafletEvent): void => {
        this.currentZoomLevel = event.target._zoom;
        this.zoomProgress = (this.currentZoomLevel - this.zoom.min) / (this.zoom.max - this.zoom.min) * 100;
        this.setOpacity();
        this.changeMarkersOpacity();
    }

    private onMapMove = (event: L.LeafletEvent): void => {
        setTimeout(() => this.currentCentre = this.map.getCenter());
    }

    private setMapView() {
        this.map.setView(this.initialCentreCoords, this.zoom.initial);
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

    private clearMarkers(): void {
        if (this.featureGroup && this.map.hasLayer(this.featureGroup)) {
            this.map.removeLayer(this.featureGroup);
        }
    }

    private addMarkersToMap(): void {
        if (!this.data) {
            return;
        }
        const markers = this.data
            .map(point => this.addMarkerToMap(point, this.currentOpacityLevel))
            .filter(marker => marker);
        this.featureGroup = L.featureGroup(markers as L.Marker[]).addTo(this.map);
   }

    private addMarkerToMap(point: IMapData, opacity: number): L.Marker | undefined {
        // Check we have co-ordinates
        if (!(point.lat && point.long)) {
            return undefined;
        }

        // Icon
        const iconOptions: L.IconOptions = point.icon ? { ...defaultIcon, iconUrl: point.icon } : defaultIcon;
        const icon = L.icon(iconOptions);

        // Marker
        const markerCoords: L.LatLngExpression = [point.lat, point.long];
        const markerOptions: L.MarkerOptions = { icon, opacity }
        const marker = L.marker(markerCoords, markerOptions);

        // Tooltip
        const tooltipText = 'Change Me';
        const tooltipOptions: L.TooltipOptions = { direction: 'top', offset: [0, -30] }
        marker.bindTooltip(tooltipText, tooltipOptions);

        // On Events
        const onClick = () => alert('Change Me');
        marker.on('click', onClick);

        // Stick a fork in me... I'm done
        return marker;
    }

    private fitBounds(): void {
        this.featureGroup.getLayers().length > 0
            ? this.map.fitBounds(this.featureGroup.getBounds(), { padding: [40, 40] })
            : this.setMapView();
    }

    private setOpacity(): void {
        this.currentOpacityLevel = this.getOpacity();
    }

    private getOpacity(): number {
        const zoomDiff = this.zoom.max - this.zoom.min;
        const opacityDiff = this.opacity.max - this.opacity.min;
        const gradient = opacityDiff / zoomDiff;
        const intercept = this.opacity.min - (gradient * this.zoom.min);
        return (gradient * this.currentZoomLevel) + intercept;
    }

    private changeMarkersOpacity(): void {
        if (this.featureGroup) {
            this.featureGroup.eachLayer((layer: any) => {
                layer.setOpacity(this.currentOpacityLevel);
            });
        }
    }
}

const defaultIcon: L.IconOptions = {
    iconUrl     : 'assets/svg/map-marker/map-marker-a.svg',
    iconSize    : [25, 25],
    iconAnchor  : [12.5, 25],
    popupAnchor : [0, -25],
}
