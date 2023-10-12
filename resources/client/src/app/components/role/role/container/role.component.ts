import { Component, OnInit } from '@angular/core';
import { IAsyncButtonInputConfig, IMatTableColumnConfig } from 'src/app/interfaces/shared.interface';
import { RoleDataSource } from '../role.data-source';
import { RoleService } from '../../../../services/role/role.service';
import { IRoleFilters } from 'src/app/interfaces/role.interface';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { Router } from '@angular/router';

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
        icon: 'cloud',
        loaded: true,
        hideRow: 'primary_role',
    }

    constructor(
        readonly roleService: RoleService,
        readonly orgService: OrganisationService,
        private _snackBar: MatSnackBar,
        private router: Router,
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
            .subscribe((res: any) => this.showRoleSnackBar(res));
    }

    public onActionButtonClick(row: any): void {
        this.actionButtonConfig.loaded = false;
        this.orgService
            .loadDataFromApi(row._id)
            .subscribe((res: any) => this.actionButtonConfig.loaded = true);
    }

    public onRowClick(row: any): void {
        this.router.navigate(['organisations'], { queryParams: { roles: row.id }});
    }

    public onIconClick(row: any): void {
        this.router.navigate(['organisations/map'], { queryParams: { roles: row.id }});
    }

    private columnConfigData(): IMatTableColumnConfig[] {
        return [
            // { columnId: 'id', columnName: 'ID', visible: true },
            { columnId: '_id', columnName: 'Internal ID', visible: true },
            { columnId: 'code', columnName: 'Code', visible: false },
            { columnId: 'display_name', columnName: 'Name', visible: true },
            { columnId: 'primary_role', columnName: 'Primary Role', visible: true },
            { columnId: 'org_last_updated', columnName: 'Organisation Last Updated', visible: true },
            { columnId: 'organisations_count', columnName: 'Active Organisations', visible: true },
            { columnId: 'icon', columnName: 'Map Icon', visible: true },
            { columnId: 'created_at', columnName: 'Created At', visible: false },
            { columnId: 'updated_at', columnName: 'Updated At', visible: false },
        ];
    }

    private showRoleSnackBar(res: any) {
        const message = {
            created: 'Created: ' + res.created + ' record(s)',
            updated: 'Updated: ' + res.updated + ' record(s)',
        }
        this.showSnackBars(message);
        this.apiLoaded = true;
    }

    private showSnackBars(messages: any) {
        const config = new MatSnackBarConfig();
        config.duration = 2000;
        const action = 'X';
        const snackBarRef = this._snackBar.open(messages.created, action, config);
        snackBarRef
            .afterDismissed()
            .subscribe(() => this._snackBar.open(messages.updated, action, config));
        this.reloadData = !this.reloadData;
    }
}
