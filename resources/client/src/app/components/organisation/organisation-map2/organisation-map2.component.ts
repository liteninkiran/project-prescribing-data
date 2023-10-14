import { Component } from '@angular/core';
import { IOrganisationFilters } from 'src/app/interfaces/organisation.interface';

@Component({
    selector: 'app-organisation-map2',
    templateUrl: './organisation-map2.component.html',
    styleUrls: ['./organisation-map2.component.scss'],
})
export class OrganisationMap2Component {

    // Filters
    public filters: IOrganisationFilters = {} as IOrganisationFilters;
    public defaultFilters: IOrganisationFilters = { status: 0 } as IOrganisationFilters;
    public message: string = '';

    public updateFilters(filters: any): void {
        this.filters = filters;
    }

}
