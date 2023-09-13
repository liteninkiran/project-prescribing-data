import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IRole } from 'src/app/interfaces/organisation2.interfaces';
import { IMatTableColumnConfig } from 'src/app/interfaces/shared.interface';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
    @Input() public dataSource!: MatTableDataSource<any>;
    @Input() public columnConfig: IMatTableColumnConfig[] = [];

    public displayedColumns: Array<string> = [];

    public ngOnInit(): void {
        this.displayedColumns = this.columnConfig.filter((config) => config.visible).map((config) => config.columnId);
    }
}
