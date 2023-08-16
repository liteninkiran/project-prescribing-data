import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IOrganisations } from 'src/app/interfaces/organisation.interfaces';

@Component({
    selector: 'app-organisation',
    templateUrl: './organisation.component.html',
    styleUrls: ['./organisation.component.scss'],
})
export class OrganisationComponent implements OnInit, OnDestroy {

    public data$: Observable<IOrganisations> = new Observable();
    public data: IOrganisations | null = null;
    public subscriptions: Subscription[] = [];

    public displayedColumns: string[] = [
        'LastChangeDate',
        'Name',
        'OrgId',
        'OrgLink',
        'OrgRecordClass',
        'PostCode',
        'PrimaryRoleDescription',
        'PrimaryRoleId',
        'Status',
    ];

    private url = 'https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PrimaryRoleId=RO177';

    constructor(private http: HttpClient) {

    }

    public ngOnInit(): void {
        this.data$ = this.getData();
        const sub: Subscription = this.data$.subscribe((d: IOrganisations) => this.data = d);
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe())
    }

    public getData(): Observable<IOrganisations> {
        return this.http.get<IOrganisations>(`${this.url}`);
    }
}
