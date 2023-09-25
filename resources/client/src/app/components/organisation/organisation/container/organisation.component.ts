import { Component, OnInit } from '@angular/core';
import { IMatTableColumnConfig } from 'src/app/interfaces/shared.interface';
import { OrganisationDataSource } from './../organisation.data-source';
import { OrganisationService } from '../../../../services/organisation/organisation.service';
import { IOrganisationFilters } from 'src/app/interfaces/organisation.interface';

@Component({
    selector: 'app-organisation',
    templateUrl: './organisation.component.html',
    styleUrls: ['./organisation.component.scss'],
    providers: [OrganisationService],
})
export class OrganisationComponent implements OnInit {
    public filters: IOrganisationFilters = {} as IOrganisationFilters;
    public dataSource!: OrganisationDataSource;
    public columnConfig: IMatTableColumnConfig[] = [];
    public apiLoaded = false;

    constructor(
        readonly orgService: OrganisationService,
    ) { }

    public ngOnInit(): void {
        this.dataSource = new OrganisationDataSource(this.orgService);
        this.columnConfig = this.columnConfigData();
        this.filters.status = 'active';
    }

    public updateFilters(filters: any): void {
        this.filters = filters;
    }

    private columnConfigData(): IMatTableColumnConfig[] {
        return [
            { columnId: 'id', columnName: 'ID', visible: false },
            { columnId: 'org_id', columnName: 'Organisation ID', visible: true },
            { columnId: 'name', columnName: 'Organisation Name', visible: true },
            { columnId: 'post_code', columnName: 'Postcode', visible: true },
            { columnId: 'primary_role_id', columnName: 'Primary Role ID', visible: false },
            { columnId: 'primary_role_description', columnName: 'Primary Role', visible: true },
            { columnId: 'status', columnName: 'Status', visible: true },
            { columnId: 'org_record_class', columnName: 'Record Class', visible: false },
            { columnId: 'last_change_date', columnName: 'Last Change Date', visible: false },
            { columnId: 'org_link', columnName: 'API Link', visible: false },
            { columnId: 'created_at', columnName: 'Created At', visible: false },
            { columnId: 'updated_at', columnName: 'Updated At', visible: false },
        ];
    }
}
