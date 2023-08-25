import { Component, OnInit, OnDestroy, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import {
    IColumnConfig,
    IRole,
    IRoles,
    IUrlObject,
} from 'src/app/interfaces/organisation.interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-role',
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.scss'],
    providers: [OrganisationService],
    encapsulation: ViewEncapsulation.None,
})
export class RoleComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(MatSort) sort!: MatSort;

    // Data
    public dataSource!: MatTableDataSource<IRole>;
    public data$: Observable<IRoles> = new Observable();
    public data: IRoles | null = null;
    public subscriptions: Subscription[] = [];
    public urlObj: IUrlObject = {
        url: '',
        baseUrl: '',
    };

    // Configuration
    public displayedColumns: string[] = [];
    public columnConfig: IColumnConfig[] = [];

    constructor(
        private orgService: OrganisationService,
    ) {
    }

    public ngOnInit(): void {
        this.setConfigData();
        this.setData();
        this.setDisplayedColumns();
    }

    public ngAfterViewInit(): void {

    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe())
    }

    private setData(): void {
        this.subscribeToData();
    }

    public setDisplayedColumns(): void {
        this.displayedColumns = this.columnConfig.filter((d) => d.visible).map((d) => d.columnId);
    }

    private setSort(): void {
        if (this.dataSource) {
            this.dataSource.sort = this.sort;
        }
    }

    private subscribeToData(): void {
        this.dataSource = new MatTableDataSource<IRole>();
        this.data = null;
        this.data$ = this.orgService.getRoles();
        const sub: Subscription = this.data$.subscribe((res: IRoles) => {
                let i = 1;
                this.data = res;
                this.data.Roles.map((o: IRole) => o.RowNum = i++);
                this.dataSource = new MatTableDataSource(this.data.Roles);
                setTimeout(() => this.setSort(), 0);
            }
        );
        this.subscriptions.push(sub);
    }

    private setConfigData(): void {
        this.columnConfig = this.columnConfigData();
    }

    private columnConfigData(): IColumnConfig[] {
        return [
            { columnId: 'RowNum', columnName: 'Row', visible: true },
            { columnId: 'id', columnName: 'ID', visible: true },
            { columnId: 'code', columnName: 'Code', visible: true },
            { columnId: 'displayName', columnName: 'Name', visible: true },
            { columnId: 'primaryRole', columnName: 'Primary Role', visible: true },
        ];
    }
}
