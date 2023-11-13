import { Component, OnInit } from '@angular/core';
import { IOrganisationFilters } from 'src/app/interfaces/organisation.interface';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';

@Component({
    selector: 'app-organisation-list',
    templateUrl: './organisation-list.component.html',
    styleUrls: ['./organisation-list.component.scss'],
    providers: [OrganisationService],
})
export class OrganisationListComponent implements OnInit {

    public filters: IOrganisationFilters = {} as IOrganisationFilters;
    public defaultFilters: IOrganisationFilters = { status: 0 } as IOrganisationFilters;
    public view: 'list' | 'map' = 'list';

    constructor(
        readonly orgService: OrganisationService,
    ) { }

    public ngOnInit(): void {

    }

    public updateFilters(filters: any): void {
        this.filters = filters;
    }

    public toggleView(event: any) {
        this.view = event.value;
    }
}
