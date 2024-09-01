import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit, OnDestroy {

    @Input() public data: any;


    public ngOnInit(): void {

    }

    public ngOnDestroy(): void {

    }

}
