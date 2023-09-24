import { Component, OnInit } from '@angular/core';
import { IMatTableColumnConfig } from 'src/app/interfaces/shared.interface';
import { RoleDataSource } from '../role.data-source';
import { RoleService } from '../../../../services/role/role.service';
import { IRoleFilters } from 'src/app/interfaces/role.interface';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
    selector: 'app-role',
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.scss'],
    providers: [RoleService],
})
export class RoleComponent implements OnInit {
    public filters: IRoleFilters = {} as IRoleFilters;
    public dataSource!: RoleDataSource;
    public columnConfig: IMatTableColumnConfig[] = [];
    public apiLoaded = false;

    constructor(
        readonly roleService: RoleService,
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

    private columnConfigData(): IMatTableColumnConfig[] {
        return [
            { columnId: 'id', columnName: 'ID', visible: false },
            { columnId: '_id', columnName: 'Internal ID', visible: true },
            { columnId: 'code', columnName: 'Code', visible: false },
            { columnId: 'display_name', columnName: 'Name', visible: true },
            { columnId: 'primary_role', columnName: 'Primary Role', visible: true },
            { columnId: 'created_at', columnName: 'Created At', visible: true },
            { columnId: 'updated_at', columnName: 'Updated At', visible: true },
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
