import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';
import { IOrganisation, IOrganisationFilters } from 'src/app/interfaces/organisation.interface';
import { OrganisationService } from '../../../services/organisation/organisation.service';

export class OrganisationDataSource implements DataSource<IOrganisation> {

    private organisationsSubject = new BehaviorSubject<IOrganisation[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private organisationService: OrganisationService) {}

    public connect(collectionViewer: CollectionViewer): Observable<IOrganisation[]> {
        return this.organisationsSubject.asObservable();
    }

    public disconnect(collectionViewer: CollectionViewer): void {
        this.organisationsSubject.complete();
        this.loadingSubject.complete();
    }

    public loadData(filters: IOrganisationFilters, sortCol = 'name', sortOrder = 'asc', pageNumber = 0, pageSize = 10): void {
        if (sortCol === 'primary_role') {
            sortCol = 'roles.display_name';
        }
        this.loadingSubject.next(true);
        this.organisationService
            .loadData(filters, sortCol, sortOrder, pageNumber, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(organisations => {
                return this.organisationsSubject.next(organisations);
            });
    }
}
