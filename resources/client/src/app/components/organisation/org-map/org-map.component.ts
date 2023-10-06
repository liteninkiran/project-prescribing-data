import { DecimalPipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IOrganisation, IOrganisationFilters, IOrganisationMapResponse } from 'src/app/interfaces/organisation.interface';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';

@Component({
    selector: 'app-org-map',
    templateUrl: './org-map.component.html',
    styleUrls: ['./org-map.component.scss'],
    providers: [OrganisationService, DecimalPipe],
})
export class OrgMapComponent implements OnInit, OnDestroy {

    public data$: Observable<IOrganisationMapResponse> = new Observable<IOrganisationMapResponse>();
    public data: IOrganisation[] = [];
    public filters: IOrganisationFilters = {} as IOrganisationFilters;
    public defaultFilters: IOrganisationFilters = { status: 0 } as IOrganisationFilters;
    public message: string = '';
    private subscriptions: Subscription[] = [];

    constructor(
        readonly orgService: OrganisationService,
        private _decimalPipe: DecimalPipe,
    ) { }

    public ngOnInit(): void {

    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe())
    }

    public updateFilters(filters: any): void {
        this.filters = filters;
        this.loadData();
    }

    public loadData(): void {
        this.data$ = this.orgService.loadMapData(this.filters);
        const sub: Subscription = this.data$.subscribe((res: IOrganisationMapResponse) => {
            this.data = res.data;
            this.setFilterMessage(res.total, res.limit, res.limit_exceeded);
        });
        this.subscriptions.push(sub);
    }

    private setFilterMessage(total: number, limit: number, limit_exceeded: boolean): void {
        const totalStr = this._decimalPipe.transform(total, '1.0-0');
        const limitStr = this._decimalPipe.transform(limit, '1.0-0');
        const warning = '<strong>Please restrict your query using the filters</strong>';
        this.message = 'Showing ';
        if (limit_exceeded) {
            this.message += limitStr + ' of ' + totalStr + ' items ' + warning;
        } else {
            this.message += totalStr + ' items';
        }
    }
}
