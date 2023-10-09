import { Component, ElementRef, Input, OnInit, AfterViewInit, OnChanges, ViewChild, SimpleChanges } from '@angular/core';
import { IMapData } from 'src/app/interfaces/shared.interface';
import * as L from 'leaflet';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'shared-controllable-map',
    templateUrl: './controllable-map.component.html',
    styleUrls: ['./controllable-map.component.scss'],
})
export class ControllableMapComponent implements OnInit, AfterViewInit, OnChanges {

    /** Private View Child Properties */
    @ViewChild('mapContainer') private mapContainer!: ElementRef;

    /** Public Properties (Inputs) */
    @Input() public data: IMapData[] | undefined;
    @Input() public mapOptions: L.MapOptions = {}
    @Input() public initialCentreCoords: L.LatLngExpression = [54.5, -4];
    @Input() public zoom = {
        min: 5,
        max: 20,
        initial: 6,
    }

    /** Public Properties */
    public currentOpacityLevel: number = 1;
    public currentZoomLevel: number = this.zoom.initial;
    public zoomProgress: number = (this.zoom.initial - this.zoom.min) / (this.zoom.max - this.zoom.min) * 100;
    public currentCentre!: L.LatLng;
    public form!: FormGroup;
    public opacityInput: FormControl<number> = new FormControl(0) as FormControl<number>;

    /** Private Properties */
    private map!: L.Map;
    private featureGroup!: L.FeatureGroup<any>;
    private opacity = {
        min: 0.25,
        max: 1,
    }
    private intervalId!: any;

    constructor() { }

    /** Public Functions (Angular) */

    public ngOnInit(): void {
        this.setOpacity();
        this.setOpacityForm();
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

    private setMapView(): void {
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
        const tooltipText = this.getTooltipText(point);
        const tooltipOptions: L.TooltipOptions = { direction: 'top', offset: [0, -30], permanent: false }
        marker.bindTooltip(tooltipText, tooltipOptions);

        // On Events
        const onClick = () => alert('Change Me');
        marker.on('click', onClick);

        // Stick a fork in me... I'm done
        return marker;
    }

    private getTooltipText(point: IMapData): string {
        return `
            <div>
                <div style="display: flex;">
                    <div style="margin-right: 15px;">
                        <img style="display: inline-block; height: 40px; width: 40px; margin-top: 4px;" src="${point.icon || defaultIcon.iconUrl}">
                    </div>
                    <div style="text-align: left; min-width: 200px; display: flex; align-items: center;">
                        <h2 style="margin-top: 0; margin-bottom: 0; white-space: normal; color: royalblue;">${point.icon_name}</h2>
                    </div>
                </div>
                <div style="white-space: normal;">
                    <h3>${point.name}</h3>
                </div>
                
                <p>${point.postcode}</p>
            </div>
        `;
    }

    private fitBounds(): void {
        this.featureGroup && this.featureGroup.getLayers().length > 0
            ? this.map.fitBounds(this.featureGroup.getBounds(), { padding: [40, 40] })
            : this.setMapView();
    }

    /** Map Events */
    private onMapZoom = (event: L.LeafletEvent): void => {
        this.currentZoomLevel = event.target._zoom;
        this.zoomProgress = (this.currentZoomLevel - this.zoom.min) / (this.zoom.max - this.zoom.min) * 100;
        this.setOpacity();
        this.changeMarkersOpacity();
    }

    private onMapMove = (event: L.LeafletEvent): void => {
        setTimeout(() => this.currentCentre = this.map.getCenter());
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

    private setOpacityForm(): void {
        this.form = new FormGroup({
            opacity: this.opacityInput,
        });

        this.opacityInput.valueChanges.subscribe((value) => {
            this.changeMarkersOpacity();
        });
    }
}

const defaultIcon: L.IconOptions = {
    iconUrl     : 'assets/svg/map-marker/map-marker-a.svg',
    iconSize    : [25, 25],
    iconAnchor  : [12.5, 25],
    popupAnchor : [0, -25],
}
