import { Component, Input, OnInit, AfterViewInit, OnChanges, ViewChild, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IColumnConfig } from 'src/app/interfaces/organisation-api.interface';
import { merge, tap } from 'rxjs';
import { IAsyncButtonInputConfig, ICheckboxMenuItem } from 'src/app/interfaces/shared.interface';

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
    @Input() public filters: any;
    @Input() public showMenu: boolean = true;
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

    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort!: MatSort;

    public get length(): number {
        return this.service.pager?.total;
    }

    public displayedColumns: string[] = [];
    public pageSizeOptions = [5, 10, 20, 50, 100];
    public intialPageSize = this.pageSizeOptions[1];
    public menuItems: ICheckboxMenuItem[] = [];

    constructor() { }

    public ngOnInit(): void {
        this.updateDisplayedColumns();
        this.setMenuItems();
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

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['filters']) {
            const filtersChange: SimpleChange = changes['filters'];
            if (!filtersChange.firstChange) {
                this.loadData();
            }
        }

        if (changes['reloadData']) {
            this.loadData();
        }
    }

    public onRowClicked(row: any): void {
        //console.log(row);
    }

    public onMenuClick(formValue: any): void {
        this.updateColumnConfig(formValue);
        this.updateMenuItems();
        this.updateDisplayedColumns();
    }

    public onActionClick(id: number): void {
        this.actionButtonClick.emit(id);
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
            const config: IColumnConfig = this.columnConfig.find(config => config.columnId === item.value) as IColumnConfig;
            item.checked = config.visible;
        });
    }

    private updateColumnConfig(formValue: any): void {
        this.columnConfig.map(config => {
            config.visible = formValue[config.columnId];
        });
    }
}
