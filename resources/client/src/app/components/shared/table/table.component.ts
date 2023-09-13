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
    @Input() public displayedColumns: Array<string> = [];
    @Input() public columnConfig: IMatTableColumnConfig[] = [];

    public ngOnInit(): void {

    }

}
