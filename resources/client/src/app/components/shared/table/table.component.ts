import { Component, Input, OnInit, AfterViewInit, OnChanges, ViewChild, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, tap } from 'rxjs';
import { IAsyncButtonInputConfig, ICheckboxMenuItem, IMatTableColumnConfig, IPaginatorConfig } from 'src/app/interfaces/shared.interface';

@Component({
    selector: 'shared-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() public paginatorConfig: IPaginatorConfig = {
        pageSizeOptions: [5, 10, 20, 50, 100],
        intialPageSize: 5,
        showFirstLastButtons: true,
        hidePageSize: false,
        disabled: false,
    }
    @Input() public service: any;
    @Input() public dataSource: any;
    @Input() public columnConfig: IMatTableColumnConfig[] = [];
    @Input() public defaultSortCol: string = 'id';
    @Input() public title!: string;
    @Input() public filters: any;
    @Input() public showMenu: boolean = true;
    @Input() public showReloadDataButton: boolean = true;
    @Input() public reloadData: boolean = false;
    @Input() public actionButtonConfig: IAsyncButtonInputConfig = {
        buttonText: 'Button',
        colour: '',
        icon: 'sync',
        loaded: true,
        hide: false,
        hideRow: '',
    }

    @Output() public actionButtonClick = new EventEmitter<number>();
    @Output() public rowClick = new EventEmitter<any>();
    @Output() public iconClick = new EventEmitter<any>();

    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort!: MatSort;

    public get length(): number {
        return this.service ? this.service.pager?.total : 0;
    }

    public displayedColumns: string[] = [];
    public menuItems: ICheckboxMenuItem[] = [];

    constructor() { }

    public ngOnInit(): void {
        this.updateDisplayedColumns();
        this.setMenuItems();
        if (!Array.isArray(this.dataSource)) {
            this.dataSource.loadData(this.filters, this.defaultSortCol, 'asc', 0, this.paginatorConfig.intialPageSize);
        }
    }

    public ngAfterViewInit(): void {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.loadData())
            )
            .subscribe();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.reloadDataOnInputChange(changes, 'filters');
        this.reloadDataOnInputChange(changes, 'reloadData');
    }

    public onRowClick(row: any): void {
        this.rowClick.emit(row);
    }

    public onIconClick(row: any): void {
        this.iconClick.emit(row);
    }

    public onMenuClick(formValue: any): void {
        this.updateColumnConfig(formValue);
        this.updateMenuItems();
        this.updateDisplayedColumns();
    }

    public onActionClick(row: any): void {
        this.actionButtonClick.emit(row);
    }

    public refreshData(): void {
        this.loadData();
    }

    private loadData(): void {
        if (!Array.isArray(this.dataSource)) {
            this.dataSource.loadData(
                this.filters,
                this.sort.active,
                this.sort.direction,
                this.paginator.pageIndex,
                this.paginator.pageSize
            );
        }
    }

    private updateDisplayedColumns(): void {
        this.displayedColumns = this.columnConfig
            .filter((config: IMatTableColumnConfig) => config.visible)
            .map((config: IMatTableColumnConfig) => config.columnId);
        if (!this.actionButtonConfig.hide) {
            this.displayedColumns.push('actions');
        }
    }

    private setMenuItems(): void {
        this.menuItems = this.columnConfig.map(config => ({
            checked: config.visible,
            formControlName: config.columnId,
            label: config.columnName,
            value: config.columnId,
        }));
    }

    private updateMenuItems(): void {
        this.menuItems.map(item => {
            const config: IMatTableColumnConfig = this.columnConfig.find(config => config.columnId === item.value) as IMatTableColumnConfig;
            item.checked = config.visible;
        });
    }

    private updateColumnConfig(formValue: any): void {
        this.columnConfig.map(config => {
            config.visible = formValue[config.columnId];
        });
    }

    private reloadDataOnInputChange(changes: SimpleChanges, inputName: string) {
        const filtersChange: SimpleChange = changes[inputName];
        if (filtersChange) {
            if (!filtersChange.firstChange) {
                this.loadData();
            }
        }
    }
}
