import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import * as topojson from 'topojson';
import * as d3 from 'd3';

@Component({
    selector: 'app-map',
    template: `
        <h1>Map</h1>
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
                        fill: #000;
                        stroke: #aaa;
                    }

                    .map path.data {
                        stroke: none;
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

    constructor(
        element: ElementRef,
    ) {
        this.host = d3.select(element.nativeElement);
    }

    public ngOnInit(): void {
        this.projection = d3.geoMercator().scale(140).translate([this.width / 2, this.height / 1.4]);
        this.path = d3.geoPath(this.projection);
        this.svg = this.host.select('svg');
        this.g = this.svg.append('g');
        const url = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json';
        d3.json(url).then((data: any) => {
            this.countries = topojson.feature(data, data.objects.countries);

            this.g
                .selectAll('path')
                .data(this.countries.features)
                .enter()
                .append('path')
                .attr('class', 'country')
                .attr('d', this.path);

        });
        console.log(this);
    }

    public ngOnDestroy(): void {

    }

}
