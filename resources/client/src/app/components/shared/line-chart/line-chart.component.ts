import { Component, ElementRef, Input, OnInit, ViewEncapsulation, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LineChartComponent implements OnInit, OnDestroy, OnChanges {

    @Input() public data: any;

    // Main elements
    public host: any;
    public svg: any;

    // Dimensions
    public dimensions: DOMRect = new DOMRect();
    public innerWidth: number = 300;
    public innerHeight: number = 150;

    public margins = {
        left: 50,
        top: 40,
        right: 20,
        bottom: 80,
    };

    // Containers
    public dataContainer: any;
    public xAxisContainer: any;
    public yAxisContainer: any;
    public legendContainer: any;
    public title: any;

    // Time formatters
    public timeParse = d3.timeParse('%Y%m%d');
    public niceData = d3.timeFormat('%B %Y');

    // Scales
    public x: any;
    public y: any;
    public colours: any;

    // Selected Data
    public selected = ['hospitalised', 'death', 'hospitalisedCurrently'];
    public active = [true, true, true];

    // Axes
    public xAxis: any;
    public yAxis: any;

    // Line generator
    public line: any;

    // Getters
    get lineData() {
        return this.selected
            .filter((d, i) => this.active[i])
            .map((item) => ({
                name: item,
                data: this.data.map((d: any) => ({
                    x: this.timeParse(d.date),
                    y: d[item],
                })).sort((a: any, b: any) => a.x < b.x ? -1 : 1),
            }));
    }

    constructor(element: ElementRef) {
        this.host = d3.select(element.nativeElement);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg');
        this.setDimensions();
        this.setElements();
        this.updateChart();
    }

    public ngOnDestroy(): void {
        
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.svg) {
            this.updateChart();
        }
    }

    private updateChart(): void {
        if (this.data) {
            this.setParams();
            this.setLabels();
            this.setAxis();
            this.setLegend();
            this.draw();
        }
    }

    private setDimensions(): void {
        this.dimensions = this.svg.node().getBoundingClientRect();
        this.innerWidth = this.dimensions.width - this.margins.left - this.margins.right;
        this.innerHeight = this.dimensions.height - this.margins.top - this.margins.bottom;
        this.svg.attr('viewBox', [0, 0, this.dimensions.width, this.dimensions.height]);
    }

    private setElements(): void {
        this.xAxisContainer = this.svg
            .append('g')
            .attr('class', 'x-axis-container')
            .attr('transform', `translate(${this.margins.left}, ${this.margins.top + this.innerHeight})`);

        this.yAxisContainer = this.svg
            .append('g')
            .attr('class', 'y-axis-container')
            .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);

        this.title = this.svg
            .append('g')
            .attr('class', 'title-container')
            .attr('transform', `translate(${this.margins.left + 0.5 * this.innerWidth}, ${0.5 * this.margins.top})`)
            .append('text')
            .attr('class', 'title')
            .style('text-anchor', 'middle');

        this.dataContainer = this.svg
            .append('g')
            .attr('class', 'data-container')
            .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);

        this.legendContainer = this.svg
            .append('g')
            .attr('class', 'legend-container')
            .attr('transform', `translate(${this.margins.left}, ${this.dimensions.height - 0.5 * this.margins.bottom + 10})`);
    }

    private setParams(): void {
        // Temporary solution
        const parsedDates = this.data.map((d: any) => this.timeParse(d.date));

        // Set Domains
        const xDomain: any = d3.extent(parsedDates);
        const maxValues = this.lineData.map((series) => series.data && d3.max(series.data, (d: any) => d.y)) || [0, 0];
        const yDomain = [0, d3.max(maxValues)];
        const colourDomain = this.selected;

        // Set Ranges
        const xRange = [0, this.innerWidth];
        const yRange = [this.innerHeight, 0];
        const colourRange = d3.schemeCategory10;

        // Set scales
        this.x = d3.scaleTime()
            .domain(xDomain)
            .range(xRange);

        this.y = d3.scaleLinear()
            .domain(yDomain)
            .range(yRange);

        this.colours = d3
            .scaleOrdinal()
            .domain(colourDomain)
            .range(colourRange);

        this.line = d3.line()
            .x((d: any) => this.x(d.x))
            .y((d: any) => this.y(d.y))
    }

    private setLabels(): void {
        this.title.text('Covid Evolution in US');
    }

    private setAxis(): void {
        this.xAxis = d3
            .axisBottom(this.x)
            .ticks(d3.timeMonth.every(3))
            .tickFormat(d3.timeFormat('%b %Y') as any)
            .tickSizeOuter(0);

        this.xAxisContainer
            .transition()
            .duration(500)
            .call(this.xAxis);

        this.yAxis = d3.axisLeft(this.y)
            .ticks(5)
            .tickSizeOuter(0)
            .tickSizeInner(-this.innerWidth)
            .tickFormat(d3.format('~s') as any);

        this.yAxisContainer
            .transition()
            .duration(500)
            .call(this.yAxis);

        // Apply dashes to all horizontal lines except the x-axis
        this.yAxisContainer
            .selectAll('.tick:not(:nth-child(2)) line')
            .style('stroke', '#ddd')
            .style('stroke-dasharray', '2 2');
    }

    private setLegend(): void {
        // Methods
        const generateLegendItems = (selection: any) => {
            selection
                .append('circle')
                .attr('class', 'legend-icon')
                .attr('cx', 3)
                .attr('cy', -4)
                .attr('r', 3);

            selection
                .append('text')
                .attr('class', 'legend-label')
                .attr('x', 9)
                .style('font-size', '0.8rem');
        };

        const updateLegendItems = (selection: any) => {
            selection
                .selectAll('circle.legend-icon')
                .style('fill', (d: any) => this.colours(d));
                selection
                .selectAll('text.legend-label')
                .text((d: any) => d);
        };

        // 1 - Select item containers and bind data
        const itemContainers = this.legendContainer.selectAll('g.legend-item').data(this.selected);

        // 2 - Enter:
        //      a: Add new containers
        //      b: Add circle & text
        //      c: Bind events (click and hover)
        //      d: Transition
        //      e: Set opacity (if active => 1 else 0.3)
        itemContainers.enter()
            .append('g')
            .attr('class', 'legend-item')
            .call(generateLegendItems)
            .merge(itemContainers)
            .call(updateLegendItems)
            .on('mouseover', (event: PointerEvent, name: string) => this.hoverLine(name))
            .on('mouseleave', () => this.hoverLine())
            .on('click', (event: PointerEvent, name: string) => {
                this.toggleActive(name);
                this.hoverLine();
                this.updateChart();
            })
            .transition()
            .duration(500)
            .style('opacity', (d: any, i: number) => this.active[i] ? 1 : 0.3);

        // 3 - Remove unneeded groups
        itemContainers.exit().remove();

        // 4 - Repositioning Items
        let totalPadding = 0;
        this.legendContainer
            .selectAll('g.legend-item')
            .each((data: any, index: number, groups: any) => {
                const g = d3.select(groups[index]);
                g.attr('transform', `translate(${totalPadding}, 0)`);
                totalPadding += g.node().getBBox().width + 10;
            });

        // 5 - Repositioning Legend
        const legendWidth = this.legendContainer.node().getBBox().width;
        const x = this.margins.left + 0.5 * (this.innerWidth - legendWidth);
        const y = this.dimensions.height - 0.5 * this.margins.bottom + 10;
        this.legendContainer.attr('transform', `translate(${x}, ${y})`);
    }

    private draw(): void {
        // Bind data
        const lines = this.dataContainer
            .selectAll('path.data')
            .data(this.lineData, (d: any) => d.name);

        // Enter and merge
        lines.enter()
            .append('path')
            .attr('class', 'data')
            .style('fill', 'none')
            .style('stroke-width', '2px')
            .merge(lines)
            .transition()
            .duration(500)
            .attr('d', (d: any) => this.line(d.data))
            .style('stroke', (d: any) => this.colours(d.name));

        // Exit
        lines.exit().remove();
    }

    private toggleActive(selected: string): void {
        const index = this.selected.indexOf(selected);
        this.active[index] = !this.active[index];
    }

    private hoverLine(selected?: string): void {
        const index = selected ? this.selected.indexOf(selected) : -1;
        if (selected && this.active[index]) {
            this.dataContainer
                .selectAll('path.data')
                .attr('opacity', (d: any) => d.name === selected ? 1 : 0.3)
                .style('stroke-width', (d: any) => d.name === selected ? '3px' : '2px');
        } else {
            this.dataContainer
                .selectAll('path.data')
                .style('stroke-width', '2px')
                .attr('opacity', null);
        }
    }
}
