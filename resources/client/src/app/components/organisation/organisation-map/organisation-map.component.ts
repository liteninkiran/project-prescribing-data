import { Component, OnInit } from '@angular/core';
import { IOrganisationFilters } from 'src/app/interfaces/organisation.interface';
import { OrganisationMapDataSource } from './organisation-map.data-source';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';

@Component({
    selector: 'app-organisation-map',
    templateUrl: './organisation-map.component.html',
    styleUrls: ['./organisation-map.component.scss'],
    providers: [OrganisationService],
})
export class OrganisationMapComponent implements OnInit {
    public filters: IOrganisationFilters = {} as IOrganisationFilters;
    public dataSource!: OrganisationMapDataSource;

    constructor(
        readonly orgService: OrganisationService,
    ) { }

    public ngOnInit(): void {
        this.dataSource = new OrganisationMapDataSource(this.orgService);
        this.dataSource.loadMapData(this.filters);
    }

    public updateFilters(filters: any): void {
        this.filters = filters;
    }
}
