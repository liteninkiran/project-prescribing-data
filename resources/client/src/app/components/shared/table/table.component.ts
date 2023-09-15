import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IColumnConfig } from 'src/app/interfaces/organisation.interfaces';
import { merge, tap } from 'rxjs';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {

    @Input() public service!: any;
    @Input() public dataSource!: any;
    @Input() public columnConfig: IColumnConfig[] = [];
    @Input() public showCount: boolean = true;
    @Input() public defaultSortCol: string = 'id';

    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort!: MatSort;

    public get length(): number {
        return this.service.pager?.total;
    }

    public displayedColumns: string[] = [];
    public pageSizeOptions = [5, 10, 20, 50, 100];
    public intialPageSize = this.pageSizeOptions[1];

    constructor() { }

    public ngOnInit(): void {
        this.displayedColumns = this.columnConfig
            .filter((config: IColumnConfig) => config.visible)
            .map((config: IColumnConfig) => config.columnId);
        this.dataSource.loadRoles('', this.defaultSortCol, 'asc', 0, this.intialPageSize);
    }

    public ngAfterViewInit() {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
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
            '',
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize
        );
    }
}
