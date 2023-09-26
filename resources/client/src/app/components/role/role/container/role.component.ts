import { Component, OnInit } from '@angular/core';
import { IAsyncButtonInputConfig, IMatTableColumnConfig } from 'src/app/interfaces/shared.interface';
import { RoleDataSource } from '../role.data-source';
import { RoleService } from '../../../../services/role/role.service';
import { IRoleFilters } from 'src/app/interfaces/role.interface';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

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
    public actionButtonConfig: IAsyncButtonInputConfig = {
        buttonText: '',
        colour: 'primary',
        icon: 'sync',
        loaded: true,
        hideRow: 'primary_role',
    }
    public paginator!: MatPaginator;
    public sort!: MatSort;

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
                this.loadData();
                this.actionButtonConfig.loaded = true;
            });
    }

    public onSort(sort: MatSort): void {
        this.sort = sort;
    }

    public onPaginate(paginator: MatPaginator): void {
        this.paginator = paginator;
    }

    private columnConfigData(): IMatTableColumnConfig[] {
        return [
            // { columnId: 'id', columnName: 'ID', visible: true },
            { columnId: '_id', columnName: 'Internal ID', visible: true },
            { columnId: 'code', columnName: 'Code', visible: false },
            { columnId: 'display_name', columnName: 'Name', visible: true },
            { columnId: 'primary_role', columnName: 'Primary Role', visible: true },
            { columnId: 'org_last_updated', columnName: 'Organisation Last Updated', visible: true },
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
        this.loadData();
    }

    private loadData(): void {
        if (this.sort && this.paginator) {
            this.dataSource.loadData(
                this.filters,
                this.sort.active,
                this.sort.direction,
                this.paginator.pageIndex,
                this.paginator.pageSize
            );
        } else {
            this.dataSource.loadData(this.filters);
        }
    }
}
