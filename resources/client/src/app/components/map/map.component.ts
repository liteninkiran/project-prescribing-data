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
                        width: 900px;
                        height: 600px;
                        border: 1px solid black;
                    }

                    .map-container {
                        width: 900px;
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .map path.country {
                        fill: #fff;
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
    public projection: d3.GeoProjection = d3.geoMercator();
    public path: d3.GeoPath<any, d3.GeoPermissibleObjects> = d3.geoPath(this.projection);
    public g: any = {};
    public countries: any;

    constructor(
        element: ElementRef,
    ) {
        this.host = d3.select(element.nativeElement);
    }

    public ngOnInit(): void {
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
