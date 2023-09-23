import { Component } from '@angular/core';
import { IMatTableColumnConfig } from 'src/app/interfaces/shared.interface';
import { OrganisationDataSource } from './../organisation.data-source';
import { OrganisationService } from '../../../../services/organisation/organisation.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
    selector: 'app-organisation',
    templateUrl: './organisation.component.html',
    styleUrls: ['./organisation.component.scss'],
    providers: [OrganisationService],
})
export class OrganisationComponent {
    public filters: any = { name: null }
    public reload: boolean = false;
    public dataSource!: OrganisationDataSource;
    public columnConfig: IMatTableColumnConfig[] = [];
    public apiLoaded = false;

    constructor(
        readonly orgService: OrganisationService,
        private _snackBar: MatSnackBar,
    ) { }

    public ngOnInit(): void {
        this.dataSource = new OrganisationDataSource(this.orgService);
        this.columnConfig = this.columnConfigData();
    }

    public updateFilters(filters: any): void {
        this.filters = filters;
        this.reload = true;
    }

    public reloaded(reload: boolean): void {
        this.reload = reload;
    }

    private columnConfigData(): IMatTableColumnConfig[] {
        return [
            { columnId: 'id', columnName: 'ID', visible: false },
            { columnId: 'org_id', columnName: 'Internal ID', visible: true },
            { columnId: 'name', columnName: 'Name', visible: true },
            { columnId: 'post_code', columnName: 'Postcode', visible: true },
            { columnId: 'primary_role_id', columnName: 'Primary Role ID', visible: false },
            { columnId: 'primary_role_description', columnName: 'Primary Role Description', visible: true },
            { columnId: 'status', columnName: 'Status', visible: true },
            { columnId: 'org_record_class', columnName: 'Record Class', visible: false },
            { columnId: 'last_change_date', columnName: 'Last Change Date', visible: false },
            { columnId: 'org_link', columnName: 'API Link', visible: false },
            { columnId: 'created_at', columnName: 'Created At', visible: false },
            { columnId: 'updated_at', columnName: 'Updated At', visible: false },
        ];
    }

    private showSnackBar(res: any) {
        const config = new MatSnackBarConfig();
        config.duration = 2000;
        const message = {
            created: 'Created: ' + res.created + ' record(s)',
            updated: 'Updated: ' + res.updated + ' record(s)',
        }
        const action = 'X';
        const snackBarRef = this._snackBar.open(message.created, action, config);
        snackBarRef
            .afterDismissed()
            .subscribe(() => this._snackBar.open(message.updated, action, config));
        this.apiLoaded = true;
        this.dataSource.loadData(this.filters);
    }

}
