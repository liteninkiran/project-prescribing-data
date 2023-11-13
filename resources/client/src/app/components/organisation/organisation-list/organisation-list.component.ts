import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IOrganisationFilters } from 'src/app/interfaces/organisation.interface';

@Component({
    selector: 'app-organisation-list',
    templateUrl: './organisation-list.component.html',
    styleUrls: ['./organisation-list.component.scss'],
})
export class OrganisationListComponent implements OnInit {

    public filters: IOrganisationFilters = {} as IOrganisationFilters;
    public defaultFilters: IOrganisationFilters = { status: 0 } as IOrganisationFilters;

    private view: 'list' | 'map' = 'list';

    constructor() {}

    public ngOnInit(): void {

    }

    public updateFilters(filters: any): void {
        this.filters = filters;
    }

    public toggleView(event: any) {
        this.view = event.value;
        console.log(' View changed to ' + this.view);
    }
}
