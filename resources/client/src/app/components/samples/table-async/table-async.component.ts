import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { RoleService } from './role.service';
import { RoleDataSource } from './role.data-source';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs';

@Component({
    selector: 'app-table-async',
    templateUrl: './table-async.component.html',
    styleUrls: ['./table-async.component.scss'],
    providers: [RoleService],
})
export class TableAsyncComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    public dataSource!: RoleDataSource;
    public displayedColumns = [
        'id',
        '_id',
        'code',
        'display_name',
        'primary_role',
        'created_at',
        'updated_at',
    ];

    constructor(
        private roleService: RoleService,
    ) {

    }

    public ngOnInit(): void {
        console.log('On Init');
        this.dataSource = new RoleDataSource(this.roleService);
        this.dataSource.loadRoles('asc', 0, 3);
    }

    public ngAfterViewInit() {
        this.paginator.page
            .pipe(
                tap(() => this.loadRolesPage())
            )
            .subscribe();
    }

    public onRowClicked(row: any) {
        console.log('Row clicked: ', row);
    }

    private loadRolesPage() {
        this.dataSource.loadRoles('asc', this.paginator.pageIndex, this.paginator.pageSize);
    }
}
