import { Component, ElementRef, Input, OnInit, AfterViewInit, OnChanges, ViewChild, SimpleChanges, EventEmitter, Output, HostListener } from '@angular/core';
import { IMapData } from 'src/app/interfaces/shared.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import * as L from 'leaflet';

@Component({
    selector: 'shared-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {

    /** Private View Child Properties */
    @ViewChild('mapContainer') private mapContainer!: ElementRef;

    @Output() public markerClicked = new EventEmitter<IMapData>();
    @Output() public manualZoom = new EventEmitter<L.LatLngBounds>();
    @Output() public roleChanged = new EventEmitter<number[]>();

    /** Public Properties (Inputs) */
    @Input() public data: IMapData[] | undefined;
    @Input() public mapOptions: L.MapOptions = {}
    @Input() public initialCentreCoords: L.LatLngExpression = [54.5, -4];
    @Input() public borderRadius = '0';
    @Input() public height = '700px';
    @Input() public width = '100%';
    @Input() public zoom = {
        min: 5,
        max: 20,
        initial: 6,
        manual: false,
    }
    @Input() public useCentreIcon = false;

    @HostListener('wheel', ['$event']) onMouseWheel(event: WheelEvent) {
        this.onMapMouseWheel(event);
    }

    /** Public Properties */
    public currentOpacityLevel: number = 1;
    public currentZoomLevel: number = this.zoom.initial;
    public zoomProgress: number = (this.zoom.initial - this.zoom.min) / (this.zoom.max - this.zoom.min) * 100;
    public form!: FormGroup;
    public opacityInput: FormControl<number> = new FormControl(0) as FormControl<number>;
    public zoomInput: any;
    public primaryRolesInput: any;
    public mapStyle = { }
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
    public centreIcon = '';

    /** Private Properties */
    private map!: L.Map;
    private featureGroup!: L.FeatureGroup<IMapData>;
    private opacity = {
        min: 0.25,
        max: 1,
    }
    private intervalId!: any;

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
        if (keys.find(key => key === 'data') && this.data) {
            this.populateMap();
            this.zoomInput.setValue(this.currentZoomLevel);
        }
    }

    /** Public Functions (Custom) */

    public resetMap(): void {
        this.zoom.manual
            ? this.zoomInput.setValue(this.zoom.initial)
            : this.fitBounds();
    }

    public animateSlider(): void {
        let i = this.opacityInput.value === 100 ? 1 : this.opacityInput.value;
        this.intervalId
            ? this.clearInterval()
            : this.intervalId = this.interval(i);
    }

    /** Private Functions */

    /** Opacity Animation */
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
        this.map.setView(coords, zoom);
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
        const markerOptions: L.MarkerOptions = { icon, opacity }
        const marker = L.marker(markerCoords, markerOptions);

        // Tooltip
        const tooltipOptions: L.TooltipOptions = { direction: 'top', offset: [0, -30], permanent: false }
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

    /** Map Events */
    private onMapZoom = (event: L.LeafletEvent): void => {
        this.currentZoomLevel = event.target._zoom;
        this.zoomProgress = (this.currentZoomLevel - this.zoom.min) / (this.zoom.max - this.zoom.min) * 100;
        this.setOpacity();
        this.changeMarkersOpacity();
        this.calculateMapBounds();
        this.updateCentreIcon();
    }

    private onMapMove = (event: L.LeafletEvent): void => {
        this.calculateMapBounds();
        this.updateCentreIcon();
    }

    private onMapMouseWheel = (event: WheelEvent): void => {
        if (this.zoom.manual) {
            const delta = event.deltaY < 0 ? 1 : -1;
            const newValue = this.zoomInput.value + delta;
            if (newValue >= this.zoom.min && newValue <= this.zoom.max) {
                this.zoomInput.setValue(newValue);
            }
        }
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

    private zoomInputChanged(value: number): void {
        if (this.map) {
            this.map.setZoom(value);
            this.manualZoom.emit(this.map.getBounds());
        }
    }

    private roleInputChanged(value: number[]): void {
        this.roleChanged.emit(value);
    }

    private setForm(): void {
        this.form = new FormGroup({
            opacity: this.opacityInput,
            zoom: this.zoomInput = new FormControl(this.currentZoomLevel) as FormControl<number>,
            primaryRoles: this.primaryRolesInput = new FormControl([]) as FormControl<number[]>,
        });

        this.opacityInput.valueChanges.subscribe((value) => {
            this.changeMarkersOpacity();
        });


        this.zoomInput.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap((value: number) => this.zoomInputChanged(value))
        ).subscribe();

        this.primaryRolesInput.valueChanges.subscribe((value: number[]) => {
            this.roleInputChanged(value);
        });
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
    }

    private distanceBetweenTwoPoints(point1: L.LatLng, point2: L.LatLng): number {
        return L.latLng(point1.lat, point1.lng)
            .distanceTo(L.latLng(point2.lat, point2.lng));
    }

    private updateCentreIcon() {
        if (this.useCentreIcon) {
            this.centreIcon = '';
            this.featureGroup.getLayers().forEach((layer: any) => {
                const point1: L.LatLng = layer.getLatLng();
                const point2: L.LatLng = this.mapBoundaryCoords.centre;
                const dist = this.distanceBetweenTwoPoints(point1, point2);
                if (dist < this.distance.x * 0.02) {
                    this.centreIcon = layer.options.icon.options.iconUrl;
                    return;
                }
            });
        }
    }
}

export const defaultIcon: L.IconOptions = {
    iconUrl     : 'assets/svg/map-marker/map-marker-a.svg',
    iconSize    : [25, 25],
    iconAnchor  : [12.5, 25],
    popupAnchor : [0, -25],
}
