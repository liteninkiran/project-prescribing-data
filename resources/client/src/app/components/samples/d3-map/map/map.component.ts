import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import * as topojson from 'topojson';
import * as d3 from 'd3';

@Component({
    selector: 'app-map',
    template: `
        <div class="map-container">
            <svg class="map">
                <style>
                    .map {
                        width: {{ this.width }}px;
                        height: {{ this.height }}px;
                        border: 1px solid black;
                    }

                    .map-container {
                        width: 900px;
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .map path.country {
                        fill: #ccc;
                        stroke: #999;
                    }

                    .map path.data {
                        stroke: none;
                    }

                    .map .faded {
                        opacity: 0.3;
                    }

                </style>
            </svg>
        </div>
    `,
})
export class MapComponent implements OnInit, OnDestroy {

    // Main elements
    public host: d3.Selection<any, any, any, any>;
    public svg: d3.Selection<any, any, any, any> = d3.selection();
    public projection!: d3.GeoProjection;
    public path!: d3.GeoPath<any, d3.GeoPermissibleObjects>;
    public g: any = {};
    public countries: any;
    public width = 900;
    public height = 600;
    public scale = 140;
    private data: any;

    constructor(
        element: ElementRef,
    ) {
        this.host = d3.select(element.nativeElement);
    }

    public ngOnInit(): void {
        this.setProjection();
        this.setPath();
        this.svg = this.host.select('svg');
        this.g = this.svg.append('g');
        this.getData();
    }

    public ngOnDestroy(): void {

    }

    private setProjection(): void {
        this.projection = d3
            .geoMercator()
            .scale(this.scale)
            .translate([this.width / 2, this.height / 1.4]);
    }

    private setPath(): void {
        this.path = d3.geoPath(this.projection);
    }

    private setData(): void {
        this.countries = topojson.feature(this.data, this.data.objects.countries);
        this.g
            .selectAll('path')
            .data(this.countries.features)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', this.path)
            .on('mouseenter', (event: MouseEvent, data: any) => {
                //console.log(this.countries);
                // this.countries.features
                //     .selectAll('path')
                //     .classed('faded', true);
            });
    }

    private getData(): void {
        const url = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json';
        d3.json(url).then((data: any) => {
            this.data = data;
            this.setData();
        });
    }
}
