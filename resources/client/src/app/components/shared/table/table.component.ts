import { Component, Input, OnInit, AfterViewInit, OnChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IColumnConfig } from 'src/app/interfaces/organisation.interfaces';
import { merge, tap } from 'rxjs';
import { IRoleFilters } from 'src/app/interfaces/organisation2.interfaces';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() public service: any;
    @Input() public dataSource: any;
    @Input() public columnConfig: IColumnConfig[] = [];
    @Input() public defaultSortCol: string = 'id';
    @Input() public title!: string;
    @Input() public filters: IRoleFilters = {} as IRoleFilters;
    @Input() public reload: boolean = false;
    @Input() public showMenu: boolean = false;

    @Output() public reloaded: EventEmitter<boolean> = new EventEmitter<boolean>();

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
        this.updateDisplayedColumns();
        this.dataSource.loadData(this.filters, this.defaultSortCol, 'asc', 0, this.intialPageSize);
    }

    public ngAfterViewInit(): void {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.loadData())
            )
            .subscribe();
    }

    public ngOnChanges(): void {
        if (this.reload) {
            this.loadData();
            this.reloaded.emit(true);
        }
    }

    public onRowClicked(row: any): void {
        //console.log(row);
    }

    public onShowHideClick(): void {
        console.log(this.columnConfig);
    }

    private loadData(): void {
        this.dataSource.loadData(
            this.filters,
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize
        );
    }

    private updateDisplayedColumns(): void {
        this.displayedColumns = this.columnConfig
            .filter((config: IColumnConfig) => config.visible)
            .map((config: IColumnConfig) => config.columnId);
    }
}
