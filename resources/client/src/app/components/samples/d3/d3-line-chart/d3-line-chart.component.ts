import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
    selector: 'app-d3-line-chart',
    templateUrl: './d3-line-chart.component.html',
    styleUrls: ['./d3-line-chart.component.scss'],
})
export class D3LineChartComponent implements OnInit, OnDestroy {

    public data$: any;

    constructor(private api: ApiService) {

    }

    public ngOnInit(): void {
        this.data$ = this.api.getCovidData();
    }

    public ngOnDestroy(): void {

    }
}
