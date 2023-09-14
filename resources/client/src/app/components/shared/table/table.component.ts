import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IMatTableColumnConfig } from 'src/app/interfaces/shared.interface';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
    @Input() public dataSource!: MatTableDataSource<any>;
    @Input() public columnConfig: IMatTableColumnConfig[] = [];
    @Input() public title: string | null = null;
    @Input() public showCount: boolean = true;

    @Output() sortData = new EventEmitter<MatSort>();

    @ViewChild(MatSort, { static: false }) sort!: MatSort;

    public displayedColumns: Array<string> = [];

    public ngOnInit(): void {
        this.displayedColumns = this.columnConfig.filter((config) => config.visible).map((config) => config.columnId);
    }

    public sortChange(event: Sort) {
        this.sortData.emit(this.sort);
    }
}
