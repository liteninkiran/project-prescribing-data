import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IMapData } from 'src/app/interfaces/shared.interface';
import * as L from 'leaflet';

@Component({
    selector: 'shared-map-new',
    templateUrl: './map2.component.html',
    styleUrls: ['./map2.component.scss'],
})
export class Map2Component implements OnInit, AfterViewInit {
    /** Private View Child Properties */
    @ViewChild('mapContainer') private mapContainer!: ElementRef;

    /** Private Output Events */

    /** Public Input Properties */
    @Input() public data: IMapData[] | null = null;
    @Input() public mapStyle: IMapStyle = {
        height: '700px',
        width: '100%',
    }
    @Input() public mapOptions: L.MapOptions = {}
    @Input() public zoom = {
        min: 5,
        max: 20,
        initial: 6,
    }

    /** Private Properties */
    private map!: L.Map;

    /** Public Functions (Angular) */
    public ngOnInit(): void {

    }

    public ngAfterViewInit(): void {
        this.initialiseMap();
    }

    /** Private Functions (Map Configuration) */
    private initialiseMap(): void {
        this.setMap();
        this.addTileLayer();
    }

    private setMap(): void {
        this.map = L.map(this.mapContainer.nativeElement, this.mapOptions).setView([51.505, -0.09], 13);
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

}

interface IMapStyle {
    [key: string]: any;
}
