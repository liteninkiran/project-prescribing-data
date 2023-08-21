import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HideMapTooltip, IPayload, MapTooltipActions, ShowMapTooltip } from './map-tooltip.actions';
import { Observable, Subscription, debounceTime, fromEvent } from 'rxjs';
import { IMapConfig, IMapData, IMapFeature } from 'src/app/interfaces/chart.interfaces';
import { DimensionService } from '../../services/d3/dimension.service';
import ObjectHelper from 'src/app/services/d3/object.helper';
import * as topojson from 'topojson';
import * as d3 from 'd3';

@Component({
    selector: 'app-map',
    template: `
        <h1>Map</h1>
        <svg class="map">
            <style>
                .map path.countries {
                    fill: {{ config.features.base.fill }};
                    stroke: {{ config.features.base.stroke }};
                }

                .chart8 path.data {
                    stroke: {{ config.features.data.stroke }};
                }

                .chart8 text.title {
                    text-anchor: middle;
                    font-size: {{ config.title.fontSize }}px;
                    font-weight: {{ config.title.fontWeight }};
                    dominant-baseline: middle;
                }

                .chart8 .highlighted rect, .chart8 path.data.highlighted {
                    stroke: {{ config.features.highlighted.stroke }};
                }

                .chart8 .faded {
                    opacity: {{ config.faded.opacity }};
                }

            </style>
        </svg>
    `,
    providers: [DimensionService],
})
export class MapComponent implements OnInit, OnDestroy {
    @Input() set geodata(values) {
        this._geodata = values;
        this.updateChart();
    };
    @Input() set data(values) {
        this._data = values;
        this.updateChart();
    };
    @Input() set config(values) {
        this._config = ObjectHelper.UpdateObjectWithPartialValues<IMapConfig>(this._defaultConfig, values);
    };

    @Output() public tooltip = new EventEmitter<MapTooltipActions>();

    // Main elements
    public host: d3.Selection<any, any, any, any>;
    public svg: d3.Selection<any, any, any, any> = d3.selection();
    public containers: any = {};
    public title: any;
    public projection: any;
    public features: any;
    public dataFeatures: any;
    public path: any;
    public colours: d3.ScaleThreshold<any, any, any> = d3.scaleThreshold();

    get geodata() {
        return this._geodata;
    }

    get data() {
        return this._data;
    }

    get config() {
        return this._config || this._defaultConfig;
    }

    private _geodata: any;
    private _data: IMapData = {
        title: '',
        data: [],
        thresholds: [],
    };
    private _config: IMapConfig = null as any;
    private _defaultConfig: IMapConfig = {
        margins: {
            top: 40,
            left: 20,
            right: 20,
            bottom: 40,
        },
        title: {
            fontWeight: 'bold',
            fontSize: 12,
        },
        features: {
            base: {
                stroke: '#aaa',
                fill: '#fff'
            },
            data: {
                stroke: 'none',
            },
            highlighted: {
                stroke: '#000',
            },
        },
        faded: {
            opacity: 0.3
        },
        noData: {
            colour: '#b4b4b4',
            label: 'No Data',
        },
        legend: {
            width: 30,
            height: 10,
            fontSize: 10,
            noDataSeparator: 20,
        },
        colours: d3.schemeOranges[9].slice(),
    };
    private subscriptions: Array<Subscription> = [];

    constructor(
        element: ElementRef,
        public dimensions: DimensionService,
    ) {
        this.host = d3.select(element.nativeElement);
        console.log(this);
    }

    public ngOnInit(): void {
        this.subscribeToChartResize();
        this.setSvg();
        this.setDimensions();
        this.setElements();
        this.updateChart();
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub) => sub.unsubscribe());
    }

    private subscribeToChartResize() {
        const resize$: Observable<any> = fromEvent(window, 'resize');
        const sub = resize$
            .pipe(debounceTime(300))
            .subscribe(() => this.resizeChart());
        this.subscriptions.push(sub);
    }

    private setSvg(): void {
        this.svg = this.host.select('svg').attr('xmlns', 'http://www.w3.org/2000/svg');
    }

    private setDimensions(): void {
        const dimensions: DOMRect = this.svg.node().getBoundingClientRect();
        this.dimensions.setDimensions(dimensions);
        this.dimensions.setMargins(this.config.margins);
    }

    private setElements(): void {
        this.containers.countries = this.svg.append('g').attr('class', 'countries');
        this.containers.countries.append('path').attr('class', 'countries');
        this.containers.data = this.svg.append('g').attr('class', 'data');
        this.containers.titleContainer = this.svg.append('g').attr('class', 'title');
        this.title = this.containers.titleContainer.append('text').attr('class', 'title');
        this.containers.legend = this.svg.append('g').attr('class', 'legend');
    }

    private updateChart(): void {
        if (this.geodata && this.svg) {
            this.repositionElements();
            this.setParams();
            this.setDataFeatures();
            this.setLabels();
            //this.setLegend();
            this.draw();
        }
    }

    private resizeChart() {
        this.setDimensions();
        this.updateChart();
    }

    private repositionElements(): void {
        this.containers.countries.attr('transform', this.getTranslations('countries-container'));
        this.containers.data.attr('transform', this.getTranslations('data-container'));
        this.containers.titleContainer.attr('transform', this.getTranslations('title-container'));
        this.containers.legend.attr('transform', this.getTranslations('legend-container'));
    }

    private getTranslations(container: string, options: any = {}): string {
        switch (container) {

            case 'countries-container':
                return `translate(
                    ${this.dimensions.marginLeft},
                    ${this.dimensions.marginTop}
                )`;

            case 'data-container':
                return `translate(
                    ${this.dimensions.marginLeft},
                    ${this.dimensions.marginTop}
                )`;

            case 'title-container':
                return `translate(
                    ${this.dimensions.midWidth},
                    ${this.dimensions.midMarginTop}
                )`;
    
            case 'legend-container':
                return `translate(
                    ${this.dimensions.midWidth},
                    ${this.dimensions.midMarginBottom}
                )`;

            case 'legend-items':
                return `translate(
                    ${options.i * options.width + (options.i && options.noDataSeparator || 0)},
                    ${0}
                )`;

            case 'legend':
                const legendBox = this.containers.legend.node().getBBox();
                return `translate(
                    ${this.dimensions.midWidth - 0.5 * legendBox.width},
                    ${this.dimensions.midMarginBottom - 0.5 * legendBox.height}
                )`;
        }
        return '';
    }

    private setParams(): void {
        this.setFeatures();
        this.setProjection();
        this.setPath();
        this.setColours();
    }

    private setProjection(): void {
        const coords: [number, number] = [
            this.dimensions.innerWidth,
            this.dimensions.innerHeight,
        ];
        this.projection = d3
            .geoEquirectangular()
            .fitSize(coords, this.features);
    }

    private setPath(): void {
        this.path = d3.geoPath(this.projection);
    }

    private setFeatures(): void {
        this.features = this.geodata.features || [];
    }

    private setColours(): void {
        this.colours = d3.scaleThreshold()
            .domain(this.data.thresholds.slice(2, this.data.thresholds.length))
            .range(this.config.colours as any);
    }

    private setDataFeatures(): void {
        if (this.data.data.length > 0) {
            const ids = new Set(this.data.data.map((d) => d.id));
            this.dataFeatures = this.features.features?.filter((feature: any) => ids.has(this.getFeatureId(feature))) || [];
        }
    }

    private setLabels(): void {
        this.title.text(this.data.title);
    }

    private draw(): void {
        this.drawBaseLayer();
        this.drawDataLayer();
    }

    private drawBaseLayer(): void {
        this.containers.countries
            .select('path.countries')
            .datum(this.features)
            .attr('d', this.path);
    }

    private drawDataLayer(): void {
        if (this.data.data.length > 0) {
            this.containers.data
                .selectAll('path.data')
                .data(this.dataFeatures)
                .join('path')
                .attr('class', 'data')
                .attr('d', this.path)
                .style('fill', (d: any) => this.colour(this.getValueByFeature(d)))
                .on('mouseenter', (event: MouseEvent, d: IMapFeature) => {
                    // Highlight current feature
                    this.highlightFeature(d);
                    // Show the tooltip
                    this.showTooltip(event, d);
                })
                .on('mouseleave', () => {
                    // Reset current feature
                    this.resetFeatures();
                    // Hide the tooltip
                    this.hideTooltip();
                });
        }
    }

    private colour(value: number | null): string {
        return value === null ? this.config.noData.colour : this.colours(value);
    }

    private getValueByFeature(feature: IMapFeature): number | null {
        const id = this.getFeatureId(feature);
        return this.data.data.find((d) => d.id === id)?.value || null;
    }

    private getFeatureId(feature: IMapFeature): string {
        return feature.properties.ISO3_CODE;
    }

    private highlightFeature(feature: IMapFeature): void {
        const id = this.getFeatureId(feature);
        this.containers.data
            .selectAll('path.data')
            .classed('highlighted', (d: any) => this.getFeatureId(d) === id);
    }

    private showTooltip(event: MouseEvent, feature: IMapFeature): void {
        const position = d3.pointer(event, this.svg.node());
        const payload: IPayload = {
            id: this.getFeatureId(feature),
            x: position[0],
            y: position[1],
        };
        const action = new ShowMapTooltip(payload);
        this.tooltip.emit(action);
    }

    private resetFeatures = (): void => {
        this.containers.countries
            .selectAll('path')
            .classed('faded', false);

        this.containers.data
            .selectAll('path.data')
            .classed('highlighted faded', false);
    }

    private hideTooltip(): void {
        const action = new HideMapTooltip();
        this.tooltip.emit(action);
    }

}
