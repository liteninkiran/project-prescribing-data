import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';
import { IRole } from 'src/app/interfaces/organisation2.interfaces';
import { RoleService } from './role.service';

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

    public loadRoles(sortDirection = 'asc', pageIndex = 0, pageSize = 3): void {
        this.loadingSubject.next(true);
        this.roleService
            .findRoles(sortDirection, pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(role => this.roleSubject.next(role));
    }
}
