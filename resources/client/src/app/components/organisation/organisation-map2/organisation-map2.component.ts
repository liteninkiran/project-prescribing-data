import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IOrganisationFilters } from 'src/app/interfaces/organisation.interface';
import { IMapData } from 'src/app/interfaces/shared.interface';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { OrganisationHelperService } from '../organisation-helper.service';

@Component({
    selector: 'app-organisation-map2',
    templateUrl: './organisation-map2.component.html',
    styleUrls: ['./organisation-map2.component.scss'],
    providers: [
        OrganisationService,
        OrganisationHelperService,
    ],
})
export class OrganisationMap2Component implements OnInit {

    // Map Data
    public mapData$: Observable<IMapData[]> = new Observable<IMapData[]>();

    // Filters
    public filters: IOrganisationFilters = {} as IOrganisationFilters;
    public defaultFilters: IOrganisationFilters = { status: 0 } as IOrganisationFilters;
    public message: string = '';

    constructor(
        private orgService: OrganisationService,
        private orgHelper: OrganisationHelperService,
    ) {

    }

    public ngOnInit(): void {

    }

    public updateFilters(filters: any): void {
        this.filters = filters;
        this.reloadMapData();
    }

    public reloadMapData(): void {
        this.mapData$ = this.orgService.loadMapData2(this.filters).pipe(
            map((res) => 
                res.data.map((org) => 
                    this.orgHelper.orgToMapData(org)
                )
            ),
        );
    }
}
