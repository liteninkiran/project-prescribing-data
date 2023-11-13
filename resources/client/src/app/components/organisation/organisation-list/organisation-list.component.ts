import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IOrganisation, IOrganisationFilters, IOrganisationMapResponse } from 'src/app/interfaces/organisation.interface';
import { IMapData } from 'src/app/interfaces/shared.interface';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { defaultIcon } from '../../shared/map/map.component';

@Component({
    selector: 'app-organisation-list',
    templateUrl: './organisation-list.component.html',
    styleUrls: ['./organisation-list.component.scss'],
    providers: [OrganisationService],
})
export class OrganisationListComponent implements OnInit, OnDestroy {

    public filters: IOrganisationFilters = {} as IOrganisationFilters;
    public defaultFilters: IOrganisationFilters = { status: 0 } as IOrganisationFilters;
    public view: 'list' | 'map' = 'list';
    public data$: Observable<IOrganisationMapResponse> = new Observable<IOrganisationMapResponse>();
    public data!: IOrganisation[];
    public mapData: IMapData[] | undefined;

    private subscriptions: Subscription[] = [];

    constructor(
        readonly orgService: OrganisationService,
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

    public toggleView(event: any) {
        this.view = event.value;
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
        });
        this.subscriptions.push(sub);
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
                    <h3>${org.name} - ${org.org_id}</h3>
                </div>
                
                <p>${org.post_code}</p>
            </div>
        `;
    }

}
