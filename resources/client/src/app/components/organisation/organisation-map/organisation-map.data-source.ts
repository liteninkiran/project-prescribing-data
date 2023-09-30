import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';
import { IOrganisation, IOrganisationFilters } from 'src/app/interfaces/organisation.interface';
import { OrganisationService } from '../../../services/organisation/organisation.service';

export class OrganisationMapDataSource implements DataSource<IOrganisation> {

    public organisationsSubject = new BehaviorSubject<IOrganisation[]>([]);
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

    public loadMapData(filters: IOrganisationFilters, sortCol = 'name', sortOrder = 'asc', pageNumber = 0, pageSize = 10): void {
        this.loadingSubject.next(true);
        this.organisationService
            .loadMapData(filters, sortCol, sortOrder, pageNumber, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(organisations => {
                //console.log(organisations);
                return this.organisationsSubject.next(organisations);
            });
    }
}
