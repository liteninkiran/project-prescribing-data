import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IMatTableColumnConfig } from 'src/app/interfaces/shared.interface';
import { RoleDataSource } from './role.data-source';
import { RoleService } from './role.service';

@Component({
    selector: 'app-role2',
    templateUrl: './role2.component.html',
    styleUrls: ['./role2.component.scss'],
    providers: [RoleService],
})
export class Role2Component implements OnInit {
    public dataSource!: RoleDataSource;
    public columnConfig: IMatTableColumnConfig[] = [
        { columnId: 'id', columnName: 'ID', visible: true },
        { columnId: '_id', columnName: 'Internal ID', visible: true },
        { columnId: 'code', columnName: 'Code', visible: true },
        { columnId: 'display_name', columnName: 'Display Name', visible: true },
        { columnId: 'primary_role', columnName: 'Primary Role', visible: true },
        { columnId: 'created_at', columnName: 'Created At', visible: false },
        { columnId: 'updated_at', columnName: 'Updated At', visible: false },
    ];
    public subscriptions: Subscription[] = [];

    constructor(
        readonly roleService: RoleService,
    ) { }

    public ngOnInit(): void {
        this.dataSource = new RoleDataSource(this.roleService);
        this.columnConfig = this.columnConfigData();
    }

    private columnConfigData(): IMatTableColumnConfig[] {
        return [
            { columnId: 'id', columnName: 'ID', visible: true },
            { columnId: '_id', columnName: 'Internal ID', visible: true },
            { columnId: 'code', columnName: 'Code', visible: true },
            { columnId: 'display_name', columnName: 'Name', visible: true },
            { columnId: 'primary_role', columnName: 'Primary Role', visible: true },
            { columnId: 'created_at', columnName: 'Created At', visible: true },
            { columnId: 'updated_at', columnName: 'Updated At', visible: true },
        ];
    }
}
