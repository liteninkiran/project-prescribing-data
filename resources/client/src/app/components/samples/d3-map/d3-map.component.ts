import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/d3/api.service';

@Component({
    selector: 'app-d3-map',
    templateUrl: './d3-map.component.html',
    styleUrls: ['./d3-map.component.scss'],
})
export class D3MapComponent implements OnInit, OnDestroy {

    public geoData$: Observable<any> = new Observable();
    public subscriptions: Subscription[] = [];

    constructor(private api: ApiService) {

    }

    public ngOnInit(): void {
        this.geoData$ = this.api.getGeoData();
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe())
    }
}
