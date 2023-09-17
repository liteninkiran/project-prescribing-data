import { Component, OnInit } from '@angular/core';
import { IMatTableColumnConfig } from 'src/app/interfaces/shared.interface';
import { RoleDataSource } from './role.data-source';
import { RoleService } from './role.service';
import { IRoleFilters } from 'src/app/interfaces/organisation2.interfaces';

@Component({
    selector: 'app-role',
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.scss'],
    providers: [RoleService],
})
export class RoleComponent implements OnInit {
    public filters: IRoleFilters = {} as IRoleFilters;
    public reload: boolean = false;
    public dataSource!: RoleDataSource;
    public columnConfig: IMatTableColumnConfig[] = [];

    constructor(
        readonly roleService: RoleService,
    ) { }

    public ngOnInit(): void {
        this.dataSource = new RoleDataSource(this.roleService);
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
            { columnId: '_id', columnName: 'Internal ID', visible: true },
            { columnId: 'code', columnName: 'Code', visible: false },
            { columnId: 'display_name', columnName: 'Name', visible: true },
            { columnId: 'primary_role', columnName: 'Primary Role', visible: true },
            { columnId: 'created_at', columnName: 'Created At', visible: false },
            { columnId: 'updated_at', columnName: 'Updated At', visible: false },
        ];
    }
}
