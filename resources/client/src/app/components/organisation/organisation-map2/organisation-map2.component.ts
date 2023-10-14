import { Component, OnInit } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { IOrganisation, IOrganisationFilters } from 'src/app/interfaces/organisation.interface';
import { IMapData } from 'src/app/interfaces/shared.interface';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { defaultIcon } from '../../shared/map/map.component';

@Component({
    selector: 'app-organisation-map2',
    templateUrl: './organisation-map2.component.html',
    styleUrls: ['./organisation-map2.component.scss'],
    providers: [OrganisationService],
})
export class OrganisationMap2Component implements OnInit {

    // Map Data
    public mapData$: Observable<IMapData[]> = new Observable<IMapData[]>();

    // Filters
    public filters: IOrganisationFilters = {} as IOrganisationFilters;
    public defaultFilters: IOrganisationFilters = { status: 0 } as IOrganisationFilters;
    public message: string = '';

    constructor(private orgService: OrganisationService) {

    }

    public ngOnInit(): void {

    }

    public updateFilters(filters: any): void {
        this.filters = filters;
        this.reloadMapData();
    }

    public reloadMapData(): void {

        const callBack = (org: IOrganisation): IMapData => ({
            id: org.id,
            icon: org.primary_role.icon || null,
            icon_name: org.primary_role.display_name,
            lat: org.postcode?.latitude || null,
            long: org.postcode?.longitude || null,
            code: org.org_id,
            name: org.name,
            postcode: org.post_code,
            tooltipText: this.getTooltipText(org),
        });

        this.mapData$ = this.orgService.loadMapData2(this.filters).pipe(
            map((res) => res.data.map((org) => callBack(org))),
        );
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
