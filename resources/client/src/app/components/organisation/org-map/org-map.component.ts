import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrganisationFilters, IOrganisationMapResponse } from 'src/app/interfaces/organisation.interface';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';

@Component({
    selector: 'app-org-map',
    templateUrl: './org-map.component.html',
    styleUrls: ['./org-map.component.scss'],
    providers: [OrganisationService],
})
export class OrgMapComponent implements OnInit {

    public data$: Observable<IOrganisationMapResponse> = new Observable<IOrganisationMapResponse>();
    public filters: IOrganisationFilters = {} as IOrganisationFilters;
    public defaultFilters: IOrganisationFilters = { status: 0 } as IOrganisationFilters;
    public message: string = '';

    constructor(
        readonly orgService: OrganisationService,
    ) { }

    public ngOnInit(): void {
        this.loadData();
    }

    public updateFilters(filters: any): void {
        this.filters = filters;
        this.loadData();
    }

    public loadData(): void {
        this.data$ = this.orgService.loadMapData(this.filters);
    }
}
