import { DecimalPipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IOrganisation, IOrganisationFilters, IOrganisationMapResponse } from 'src/app/interfaces/organisation.interface';
import { IMapData } from 'src/app/interfaces/shared.interface';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { defaultIcon } from 'src/app/components/shared/map/map.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-organisation-map',
    templateUrl: './organisation-map.component.html',
    styleUrls: ['./organisation-map.component.scss'],
    providers: [OrganisationService, DecimalPipe],
})
export class OrganisationMapComponent implements OnInit, OnDestroy {

    public data$: Observable<IOrganisationMapResponse> = new Observable<IOrganisationMapResponse>();
    public data!: IOrganisation[];
    public mapData: IMapData[] | undefined;
    public filters: IOrganisationFilters = {} as IOrganisationFilters;
    public defaultFilters: IOrganisationFilters = { status: 0 } as IOrganisationFilters;
    public message: string = '';
    private subscriptions: Subscription[] = [];

    constructor(
        readonly orgService: OrganisationService,
        private _decimalPipe: DecimalPipe,
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
            this.mapData = this.data.map((data) => {
                return {
                    id: data.id,
                    icon: data.primary_role.icon || null,
                    icon_name: data.primary_role.display_name,
                    lat: data.postcode?.latitude || null,
                    long: data.postcode?.longitude || null,
                    code: data.org_id,
                    name: data.name,
                    postcode: data.post_code,
                    tooltipText: this.getTooltipText(data),
                }
            });
            this.setFilterMessage(res.total, res.limit, res.limit_exceeded);
        });
        this.subscriptions.push(sub);
    }

    public onMarkerClick(data: IMapData) {
        this.router.navigate(['organisations/' + data.code]);
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

    private getTooltipText(org: IOrganisation): string {
        return `
            <div>
                <div style="display: flex;">
                    <div style="margin-right: 15px;">
                        <img style="display: inline-block; height: 40px; width: 40px; margin-top: 4px;" src="${org.primary_role.icon || defaultIcon.iconUrl}">
                    </div>
                    <div style="text-align: left; min-width: 200px; display: flex; align-items: center;">
                        <h2 style="margin-top: 0; margin-bottom: 0; white-space: normal; color: royalblue;">${org.primary_role.display_name}</h2>
                    </div>
                </div>
                <div style="white-space: normal;">
                    <h3>${org.name}</h3>
                </div>
                
                <p>${org.post_code}</p>
            </div>
        `;
    }
}
