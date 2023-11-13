import { Component, OnInit } from '@angular/core';
import { IOrganisationFilters } from 'src/app/interfaces/organisation.interface';
import { OrganisationDataSource } from '../organisation/organisation.data-source';
import { IAsyncButtonInputConfig, IMatTableColumnConfig, IPaginatorConfig } from 'src/app/interfaces/shared.interface';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-organisation-list',
    templateUrl: './organisation-list.component.html',
    styleUrls: ['./organisation-list.component.scss'],
    providers: [OrganisationService],
})
export class OrganisationListComponent implements OnInit {

    public filters: IOrganisationFilters = {} as IOrganisationFilters;
    public defaultFilters: IOrganisationFilters = { status: 0 } as IOrganisationFilters;
    public dataSource!: OrganisationDataSource;
    public columnConfig: IMatTableColumnConfig[] = [];
    public actionButtonConfig: IAsyncButtonInputConfig = {
        buttonText: '',
        colour: 'primary',
        icon: 'visibility',
        loaded: true,
        hide: true,
        hideRow: 'primary_role',
    }
    public paginatorConfig: IPaginatorConfig = {
        pageSizeOptions: [5, 10, 20, 50, 100],
        intialPageSize: 10,
        showFirstLastButtons: true,
        hidePageSize: false,
        disabled: false,
    }
    public view: 'list' | 'map' = 'list';

    constructor(
        readonly orgService: OrganisationService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    public ngOnInit(): void {
        this.dataSource = new OrganisationDataSource(this.orgService);
        this.columnConfig = this.columnConfigData();
    }

    public updateFilters(filters: any): void {
        this.filters = filters;
    }

    public onActionButtonClick(id: number): void {
        alert(id);
    }

    public onRowClick(row: any): void {
        this.router.navigate([row.org_id], { relativeTo: this.route });
    }

    public toggleView(event: any) {
        this.view = event.value;
    }

    private columnConfigData(): IMatTableColumnConfig[] {
        return [
            { columnId: 'org_id', columnName: 'Organisation ID', visible: true },
            { columnId: 'name', columnName: 'Organisation Name', visible: true },
            { columnId: 'post_code', columnName: 'Postcode', visible: true },
            { columnId: 'primary_role', columnName: 'Primary Role', visible: true, property: 'display_name' },
            { columnId: 'status', columnName: 'Status', visible: true },
            { columnId: 'org_record_class', columnName: 'Record Class', visible: false },
            { columnId: 'last_change_date', columnName: 'Last Change Date', visible: false },
            { columnId: 'org_link', columnName: 'API Link', visible: false },
            { columnId: 'created_at', columnName: 'Created At', visible: false },
            { columnId: 'updated_at', columnName: 'Updated At', visible: false },
        ];
    }
}
