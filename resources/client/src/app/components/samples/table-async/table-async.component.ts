import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RoleService } from './role.service';
import { RoleDataSource } from './role.data-source';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, fromEvent, merge, tap } from 'rxjs';
import { MatSort } from '@angular/material/sort';

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
    public displayedColumns = [
        'id',
        '_id',
        'code',
        'display_name',
        'primary_role',
    ];
    public pageSizeOptions = [5, 10, 20, 50, 100];
    public intialPageSize = this.pageSizeOptions[1];

    constructor(
        private roleService: RoleService,
    ) {

    }

    public ngOnInit(): void {
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
