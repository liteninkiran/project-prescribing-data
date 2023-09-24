import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';
import { IRole, IRoleFilters } from 'src/app/interfaces/role.interface';
import { RoleService } from '../../../services/role/role.service';

export class RoleDataSource implements DataSource<IRole> {

    private roleSubject = new BehaviorSubject<IRole[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private roleService: RoleService) {}

    public connect(collectionViewer: CollectionViewer): Observable<IRole[]> {
        return this.roleSubject.asObservable();
    }

    public disconnect(collectionViewer: CollectionViewer): void {
        this.roleSubject.complete();
        this.loadingSubject.complete();
    }

    public loadData(filters: IRoleFilters, sortCol = 'display_name', sortOrder = 'asc', pageNumber = 0, pageSize = 10): void {
        this.loadingSubject.next(true);
        this.roleService
            .loadData(filters, sortCol, sortOrder, pageNumber, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(role => this.roleSubject.next(role));
    }
}
