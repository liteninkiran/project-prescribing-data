import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription, map } from 'rxjs';
import { IRole } from 'src/app/interfaces/organisation2.interfaces';
import { IMatTableColumnConfig } from 'src/app/interfaces/shared.interface';
import { Organisation2Service } from 'src/app/services/organisation/organisation2.service';

@Component({
    selector: 'app-role2',
    templateUrl: './role2.component.html',
    styleUrls: ['./role2.component.scss'],
})
export class Role2Component implements OnInit, OnDestroy {
    public dataSource!: MatTableDataSource<any>;
    public roles$: Observable<IRole[]> = new Observable();
    public displayedColumns: string[] = [];
    public columnConfig: IMatTableColumnConfig[] = [];
    public subscriptions: Subscription[] = [];

    constructor(
        private orgService: Organisation2Service,
    ) {
    }

    public ngOnInit(): void {
        this.columnConfig = this.columnConfigData();
        this.displayedColumns = this.columnConfig.filter((config) => config.visible).map((config) => config.columnId);
        this.roles$ = this.orgService.getRoles().pipe(
            map((roles: IRole[]) => {
                return roles.map((role: IRole): IRole => {
                    return {
                        ...role,
                        primary_role: !!role.primary_role,
                        created_at: new Date(role.created_at),
                        updated_at: new Date(role.updated_at),
                    };
                });
            })
        );
        const sub: Subscription = this.roles$.subscribe((data) => {
            this.dataSource = new MatTableDataSource(data);
        });
        this.subscriptions.push(sub);
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe())
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
