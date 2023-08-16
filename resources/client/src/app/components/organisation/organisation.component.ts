import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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

    public displayedColumns: string[] = [];
    public columns: string[] = [
        'OrgId',
        'Name',
        'OrgLink',
        'OrgRecordClass',
        'PostCode',
        'PrimaryRoleDescription',
        'PrimaryRoleId',
        'Status',
        'LastChangeDate',
    ];
    public formGroup = this.fb.group({
        'OrgId': true,
        'Name': true,
        'OrgLink': false,
        'OrgRecordClass': false,
        'PostCode': true,
        'PrimaryRoleDescription': false,
        'PrimaryRoleId': false,
        'Status': true,
        'LastChangeDate': false,
    });

    private url = 'https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PrimaryRoleId=RO177';

    constructor(
        private http: HttpClient,
        private fb: FormBuilder,
    ) {

    }

    public ngOnInit(): void {
        this.data$ = this.getData();
        const sub: Subscription = this.data$.subscribe((d: IOrganisations) => this.data = d);
        this.subscriptions.push(sub);
        this.refreshColumnDisplay();
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe())
    }

    public getData(): Observable<IOrganisations> {
        return this.http.get<IOrganisations>(`${this.url}`);
    }

    public toggleColumn() {
        this.refreshColumnDisplay();
    }

    private refreshColumnDisplay() {
        const obj: any = {};
        Object.assign(obj, this.formGroup.value)
        this.displayedColumns = this.columns.filter(column => obj[column]);
    }
}
