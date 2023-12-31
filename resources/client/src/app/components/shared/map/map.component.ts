import { Component, ElementRef, Input, OnInit, AfterViewInit, OnChanges, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { IMapData } from 'src/app/interfaces/shared.interface';
import { FormControl, FormGroup } from '@angular/forms';
import * as L from 'leaflet';

interface IMapStyle {
    [key: string]: any;
}

@Component({
    selector: 'shared-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {

    /** Private View Child Properties */
    @ViewChild('mapContainer') private mapContainer!: ElementRef;

    /** Private Output Events */
    @Output() private markerClicked = new EventEmitter<IMapData>();
    @Output() private manualZoom = new EventEmitter<number>();

    /** Public Input Properties */
    @Input() public data: IMapData[] | undefined;
    @Input() public mapOptions: L.MapOptions = {}
    @Input() public initialCentreCoords: L.LatLngExpression = [54.5, -4];
    @Input() public borderRadius = '0';
    @Input() public height = '700px';
    @Input() public width = '100%';
    @Input() public circleRadius = 100;
    @Input() public zoom = {
        min: 5,
        max: 20,
        initial: 6,
        manual: false,
    }

    /** Public Properties */
    public currentOpacityLevel: number = 1;
    public currentZoomLevel: number = this.zoom.initial;
    public zoomProgress: number = (this.zoom.initial - this.zoom.min) / (this.zoom.max - this.zoom.min) * 100;
    public form!: FormGroup;
    public opacityInput: FormControl<number> = new FormControl(1) as FormControl<number>;
    public mapStyle: IMapStyle = { }
    public mapBoundaryCoords = {
        centre: {} as L.LatLng,
        southEast: {} as L.LatLng,
        southWest: {} as L.LatLng,
        northEast: {} as L.LatLng,
        northWest: {} as L.LatLng,
    };
    public distance = {
        x: 0,
        y: 0,
    }
    public noMarkers = false;

    /** Private Properties */
    private map!: L.Map;
    private featureGroup!: L.FeatureGroup<IMapData>;
    private featureGroupCircle!: L.FeatureGroup;
    private opacity = {
        min: 0.25,
        max: 1,
    }
    private intervalId!: any;
    private mapViewSet = false;

    constructor() { }

    /** Public Functions (Angular) */

    public ngOnInit(): void {
        this.setOpacity();
        this.setForm();
        this.setMapStyle();
    }

    public ngAfterViewInit(): void {
        this.initialiseMap();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const keys = Object.keys(changes);
        if (keys.find(key => key === 'data')) {
            if (this.data) {
                this.populateMap();
            }
        }
        if (keys.find(key => key === 'circleRadius')) {
            this.addCircleToMap();
        }
    }

    /** Public Functions (Custom) */

    public resetMap(): void {
        this.fitBounds();
    }

    public animateSlider(): void {
        let i = this.opacityInput.value === 100 ? 1 : this.opacityInput.value;
        this.intervalId
            ? this.clearInterval()
            : this.intervalId = this.interval(i);
    }

    /** Private Functions */

    /** Map Configuration */
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

    private setMapView(coords: any = this.initialCentreCoords, zoom: number = this.zoom.initial): void {
        if (!this.mapViewSet || !this.zoom.manual) {
            this.map.setView(coords, zoom);
            this.mapViewSet = true;
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

    private clearMarkers(): void {
        if (this.featureGroup && this.map.hasLayer(this.featureGroup)) {
            this.map.removeLayer(this.featureGroup);
        }
    }

    private clearCircle(): void {
        if (this.featureGroupCircle && this.map.hasLayer(this.featureGroupCircle)) {
            this.map.removeLayer(this.featureGroupCircle);
        }
    }

    private addCircleToMap(): void {
        if (!this.mapOptions.zoomControl || this.borderRadius !== '0' || !this.map) { return; }
        this.clearCircle();
        const circleOptions: L.CircleOptions = {
            radius: this.distance.x / 2 * (this.circleRadius / 100),
            dashArray: '30 10',
            weight: 2,
            color: '#3388ff',
            opacity: 0.5,
            interactive: false,
            fill: true,
            fillColor: '#3388ff',
            fillOpacity: 0.05,
        }
        const circle = L.circle(this.initialCentreCoords, circleOptions);
        this.featureGroupCircle = L.featureGroup([circle]).addTo(this.map);
    }

    private addMarkersToMap(): void {
        if (!this.data) {
            return;
        }
        const markers = this.data
            .map(point => this.addMarkerToMap(point, this.opacityInput.value > 0 ? this.opacityInput.value : this.currentOpacityLevel))
            .filter(marker => marker);
        this.noMarkers = markers.length === 0 && this.zoom.manual;
        this.featureGroup = L.featureGroup(markers as L.Marker<IMapData>[]).addTo(this.map);
    }

    private addMarkerToMap(data: IMapData, opacity: number): L.Marker<IMapData> | undefined {
        // Check we have co-ordinates
        if (!(data.lat && data.long)) {
            return undefined;
        }

        // Icon
        const iconOptions: L.IconOptions = data.icon ? { ...defaultIcon, iconUrl: data.icon } : defaultIcon;
        const icon = L.icon(iconOptions);

        // Marker
        const markerCoords: L.LatLngExpression = [data.lat, data.long];
        const markerOptions: L.MarkerOptions = { icon, opacity, autoPanOnFocus: !this.zoom.manual }
        const marker = L.marker(markerCoords, markerOptions);

        // Tooltip
        const centreLat = this.initialCentreCoords[0 as keyof L.LatLngBoundsExpression] as number;
        const direction: L.Direction = !this.zoom.manual ? 'top' : (data.lat > centreLat ? 'bottom': 'top');
        const offset: L.PointExpression = direction === 'top' ? [0, -30] : [0, 0];
        const tooltipOptions: L.TooltipOptions = { direction, offset, permanent: false }
        marker.bindTooltip(data.tooltipText, tooltipOptions);

        // On Events
        const onClick = () => this.markerClicked.emit(data);
        marker.on('click', onClick);

        // Stick a fork in me... I'm done
        return marker;
    }

    private fitBounds(): void {
        this.featureGroup && this.featureGroup.getLayers().length > 0 && !this.zoom.manual
            ? this.map.fitBounds(this.featureGroup.getBounds(), { padding: [40, 40] })
            : this.setMapView();
    }

    private setMapStyle(): void {
        this.mapStyle = {
            'border-radius': this.borderRadius,
            'height': this.height,
            'width': this.width,
        }
    }

    private calculateMapBounds() {
        if (!this.map) { return; }
        const bounds: L.LatLngBounds = this.map.getBounds();
        this.mapBoundaryCoords = {
            centre: bounds.getCenter(),
            southEast: bounds.getSouthEast(),
            southWest: bounds.getSouthWest(),
            northEast: bounds.getNorthEast(),
            northWest: bounds.getNorthWest(),
        }
        this.distance.x = this.distanceBetweenTwoPoints(this.mapBoundaryCoords.southWest, this.mapBoundaryCoords.southEast);
        this.distance.y = this.distanceBetweenTwoPoints(this.mapBoundaryCoords.southWest, this.mapBoundaryCoords.northWest);
        this.addCircleToMap();
    }

    private distanceBetweenTwoPoints(point1: L.LatLng, point2: L.LatLng): number {
        return L.latLng(point1.lat, point1.lng)
            .distanceTo(L.latLng(point2.lat, point2.lng));
    }

    /** Map Events */
    private onMapZoom = (event: L.LeafletEvent): void => {
        this.currentZoomLevel = event.target._zoom;
        this.zoomProgress = (this.currentZoomLevel - this.zoom.min) / (this.zoom.max - this.zoom.min) * 100;
        this.setOpacity();
        this.changeMarkersOpacity();
        this.calculateMapBounds();
        this.manualZoom.emit(this.distance.x / 2);
    }

    private onMapMove = (event: L.LeafletEvent): void => {
        this.calculateMapBounds();
    }

    /** Opacity */
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
                layer.setOpacity(this.opacityInput.value / 100 || this.currentOpacityLevel);
            });
        }
    }

    private clearInterval() {
        clearInterval(this.intervalId);
        this.intervalId = undefined;
    }

    private interval(i: number): any {
        return setInterval(() =>
            (i += 1) === 101
                ? this.clearInterval()
                : this.opacityInput.setValue(i), 100);
    }

    /** Form */
    private setForm(): void {
        this.opacityInput = new FormControl(this.zoom.manual ? 100: 0) as FormControl<number>;

        this.form = new FormGroup({
            opacity: this.opacityInput
        });

        this.opacityInput.valueChanges.subscribe((value) => {
            this.changeMarkersOpacity();
        });
    }
}

export const defaultIcon: L.IconOptions = {
    iconUrl     : 'assets/svg/map-marker/map-marker-a.svg',
    iconSize    : [25, 25],
    iconAnchor  : [12.5, 25],
    popupAnchor : [0, -25],
}
