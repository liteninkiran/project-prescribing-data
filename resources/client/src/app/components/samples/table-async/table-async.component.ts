import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RoleService } from './role.service';
import { RoleDataSource } from './role.data-source';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, fromEvent, merge, tap } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { IMatTableColumnConfig } from 'src/app/interfaces/shared.interface';

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
    public columnConfig: IMatTableColumnConfig[] = [
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
            .filter((config: IMatTableColumnConfig) => config.visible)
            .map((config: IMatTableColumnConfig) => config.columnId);
        this.dataSource = new RoleDataSource(this.roleService);
        this.dataSource.loadData('', 'display_name', 'asc', 0, this.intialPageSize);
    }

    public ngAfterViewInit() {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        fromEvent(this.displayName.nativeElement, 'input')
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.loadData();
                })
            )
            .subscribe();
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.loadData())
            )
            .subscribe();
    }

    public onRowClicked(row: any) {
        //console.log(row);
    }

    private loadData() {
        this.dataSource.loadData(
            this.displayName.nativeElement.value,
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize
        );
    }
}
