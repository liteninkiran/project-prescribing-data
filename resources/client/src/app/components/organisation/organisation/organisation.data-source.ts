import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';
import { IOrganisation, IOrganisationFilters } from 'src/app/interfaces/organisation.interface';
import { OrganisationService } from '../../../services/organisation/organisation.service';

export class OrganisationDataSource implements DataSource<IOrganisation> {

    private organisationSubject = new BehaviorSubject<IOrganisation[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private organisationService: OrganisationService) {}

    public connect(collectionViewer: CollectionViewer): Observable<IOrganisation[]> {
        return this.organisationSubject.asObservable();
    }

    public disconnect(collectionViewer: CollectionViewer): void {
        this.organisationSubject.complete();
        this.loadingSubject.complete();
    }

    public loadData(filters: IOrganisationFilters, sortCol = 'name', sortOrder = 'asc', pageNumber = 0, pageSize = 10): void {
        this.loadingSubject.next(true);
        this.organisationService
            .loadData(filters, sortCol, sortOrder, pageNumber, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(organisation => this.organisationSubject.next(organisation));
    }
}
