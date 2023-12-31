import { Component, OnInit } from '@angular/core';
import { IRoleFilters } from 'src/app/interfaces/role.interface';
import { IMatTableColumnConfig } from 'src/app/interfaces/shared.interface';
import { RoleService } from '../../../services/role/role.service';
import { RoleDataSource } from '../../role/role/role.data-source';

@Component({
    selector: 'shared-table-async',
    templateUrl: './table-async.component.html',
    styleUrls: ['./table-async.component.scss'],
    providers: [RoleService],
})
export class TableAsyncComponent implements OnInit {
    public filters: IRoleFilters = {} as IRoleFilters;
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
