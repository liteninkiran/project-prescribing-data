import { Component, OnInit } from '@angular/core';
import { IAsyncButtonInputConfig, IMatTableColumnConfig } from 'src/app/interfaces/shared.interface';
import { RoleDataSource } from '../role.data-source';
import { RoleService } from '../../../../services/role/role.service';
import { IRoleFilters } from 'src/app/interfaces/role.interface';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';

@Component({
    selector: 'app-role',
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.scss'],
    providers: [RoleService, OrganisationService],
})
export class RoleComponent implements OnInit {
    public filters: IRoleFilters = {} as IRoleFilters;
    public dataSource!: RoleDataSource;
    public columnConfig: IMatTableColumnConfig[] = [];
    public apiLoaded = false;
    public reloadData: boolean = false;
    public actionButtonConfig: IAsyncButtonInputConfig = {
        buttonText: '',
        colour: 'primary',
        icon: 'sync',
        loaded: true,
        hideRow: 'primary_role',
    }

    constructor(
        readonly roleService: RoleService,
        readonly orgService: OrganisationService,
        private _snackBar: MatSnackBar,
    ) { }

    public ngOnInit(): void {
        this.dataSource = new RoleDataSource(this.roleService);
        this.columnConfig = this.columnConfigData();
    }

    public updateFilters(filters: any): void {
        this.filters = filters;
    }

    public refreshDataFromApi(): void {
        this.apiLoaded = false;
        this.roleService
            .loadDataFromApi()
            .subscribe((res: any) => this.showSnackBar(res));
    }

    public onActionButtonClick(id: number): void {
        const _id: string = this.dataSource.getInternalId(id);
        this.actionButtonConfig.loaded = false;
        this.orgService
            .loadDataFromApi(_id)
            .subscribe(() => {
                // Reload data
                this.reloadData = !this.reloadData;
                this.actionButtonConfig.loaded = true;
            });
    }

    private columnConfigData(): IMatTableColumnConfig[] {
        return [
            // { columnId: 'id', columnName: 'ID', visible: true },
            { columnId: '_id', columnName: 'Internal ID', visible: true },
            { columnId: 'code', columnName: 'Code', visible: false },
            { columnId: 'display_name', columnName: 'Name', visible: true },
            { columnId: 'primary_role', columnName: 'Primary Role', visible: true },
            { columnId: 'org_last_updated', columnName: 'Organisation Last Updated', visible: true },
            { columnId: 'organisations_count', columnName: 'Organisations', visible: true },
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
        // Reload data
        this.reloadData = !this.reloadData;
    }
}
