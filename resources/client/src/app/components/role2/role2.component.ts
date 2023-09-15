import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription, map } from 'rxjs';
import { IPagedList, IRole } from 'src/app/interfaces/organisation2.interfaces';
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
    public columnConfig: IMatTableColumnConfig[] = [];
    public subscriptions: Subscription[] = [];

    constructor(
        private orgService: Organisation2Service,
    ) {
    }

    public ngOnInit(): void {
        this.columnConfig = this.columnConfigData();
        this.roles$ = this.orgService.getRoles().pipe(
            map((pager: IPagedList) => {
                return pager.data.map((role: IRole): IRole => {
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

    public sortOutput(matSort: MatSort) {
        this.dataSource.sort = matSort;
    }

    public paginatorOutput(matPaginator: MatPaginator) {
        if (this.dataSource && !this.dataSource.paginator && matPaginator) {
            this.dataSource.paginator = matPaginator;
        }
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
