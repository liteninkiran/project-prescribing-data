import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RoleService } from './role.service';
import { RoleDataSource } from './role.data-source';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, fromEvent, merge, tap } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { IColumnConfig } from 'src/app/interfaces/organisation2.interfaces';

@Component({
    selector: 'app-table-async',
    templateUrl: './table-async.component.html',
    styleUrls: ['./table-async.component.scss'],
    providers: [RoleService],
})
export class TableAsyncComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort!: MatSort;
    @ViewChild('displayName', { static: true }) displayName!: ElementRef;

    public get length(): number {
        return this.roleService.pager?.total;
    }

    public dataSource!: RoleDataSource;
    public columnConfig: IColumnConfig[] = [
        { columnId: 'id', columnName: 'ID', visible: true },
        { columnId: '_id', columnName: 'Internal ID', visible: true },
        { columnId: 'code', columnName: 'Code', visible: true },
        { columnId: 'display_name', columnName: 'Display Name', visible: true },
        { columnId: 'primary_role', columnName: 'Primary Role', visible: true },
        { columnId: 'created_at', columnName: 'Created At', visible: false },
        { columnId: 'updated_at', columnName: 'Updated At', visible: false },
    ];
    public displayedColumns: string[] = [];
    public pageSizeOptions = [5, 10, 20, 50, 100];
    public intialPageSize = this.pageSizeOptions[1];

    constructor(
        private roleService: RoleService,
    ) {

    }

    public ngOnInit(): void {
        this.displayedColumns = this.columnConfig
            .filter((config: IColumnConfig) => config.visible)
            .map((config: IColumnConfig) => config.columnId);
        this.dataSource = new RoleDataSource(this.roleService);
        this.dataSource.loadRoles('', 'display_name', 'asc', 0, this.intialPageSize);
    }

    public ngAfterViewInit() {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        fromEvent(this.displayName.nativeElement, 'input')
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.loadRolesPage();
                })
            )
            .subscribe();
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.loadRolesPage())
            )
            .subscribe();
    }

    public onRowClicked(row: any) {
        console.log(row);
    }

    private loadRolesPage() {
        this.dataSource.loadRoles(
            this.displayName.nativeElement.value,
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize
        );
    }
}
