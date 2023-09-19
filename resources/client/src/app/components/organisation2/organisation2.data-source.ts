import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';
import { OrganisationService } from './organisation2.service';

export class OrganisationDataSource implements DataSource<any> {

    private organisationSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private organisationService: OrganisationService) {}

    public connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.organisationSubject.asObservable();
    }

    public disconnect(collectionViewer: CollectionViewer): void {
        this.organisationSubject.complete();
        this.loadingSubject.complete();
    }

    public loadData(filters: any, sortCol = 'name', sortOrder = 'asc', pageNumber = 0, pageSize = 10): void {
        this.loadingSubject.next(true);
        this.organisationService
            .loadData(filters, sortCol, sortOrder, pageNumber, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(organisation => this.organisationSubject.next(organisation));
    }
}
