import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IOrganisation, IOrganisationFilters, IOrganisationMapResponse } from 'src/app/interfaces/organisation.interface';
import { IMapData } from 'src/app/interfaces/shared.interface';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { Router } from '@angular/router';
import { OrganisationHelperService } from '../organisation-helper.service';

@Component({
    selector: 'app-organisation-map',
    templateUrl: './organisation-map.component.html',
    styleUrls: ['./organisation-map.component.scss'],
    providers: [OrganisationService],
})
export class OrganisationMapComponent implements OnInit, OnDestroy {

    public data$: Observable<IOrganisationMapResponse> = new Observable<IOrganisationMapResponse>();
    public data!: IOrganisation[];
    public mapData: IMapData[] | undefined;
    public filters: IOrganisationFilters = {} as IOrganisationFilters;
    public defaultFilters: IOrganisationFilters = { status: 0 } as IOrganisationFilters;
    public message: string = '';
    public mapOptions: L.MapOptions = {}
    private subscriptions: Subscription[] = [];

    constructor(
        readonly orgService: OrganisationService,
        private orgHelper: OrganisationHelperService,
        private router: Router,
    ) { }

    public ngOnInit(): void {
        
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe())
    }

    public updateFilters(filters: any): void {
        this.mapData = undefined;
        this.filters = filters;
        this.loadData();
    }

    public loadData(): void {
        this.data$ = this.orgService.loadMapData(this.filters);
        const sub: Subscription = this.data$.subscribe((res: IOrganisationMapResponse) => {
            this.data = res.data;
            this.mapData = this.data.map((data) => this.orgHelper.orgToMapData(data));
            this.message = this.orgHelper.getFilterMessage(res.total, res.limit, res.limit_exceeded);
        });
        this.subscriptions.push(sub);
    }

    public onMarkerClick(data: IMapData) {
        this.router.navigate(['organisations/' + data.code]);
    }
}
