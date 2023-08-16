import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { IOrganisations } from 'src/app/interfaces/organisation.interfaces';

@Component({
    selector: 'app-organisation',
    templateUrl: './organisation.component.html',
    styleUrls: ['./organisation.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class OrganisationComponent implements OnInit, OnDestroy {

    public data$: Observable<IOrganisations> = new Observable();
    public data: IOrganisations | null = null;
    public subscriptions: Subscription[] = [];

    public displayedColumns: string[] = [];
    public columns: string[] = [
        'OrgId',
        'Name',
        'PostCode',
        'Status',
        'OrgLink',
        'OrgRecordClass',
        'PrimaryRoleDescription',
        'PrimaryRoleId',
        'LastChangeDate',
    ];
    public columnConfig: {
        columnId: string;
        columnName: string;
        visible: boolean;
    }[] = [
        {
            columnId: 'OrgId',
            columnName: 'Organisation ID',
            visible: true,
        },
        {
            columnId: 'Name',
            columnName: 'Organisation Name',
            visible: true,
        },
        {
            columnId: 'PostCode',
            columnName: 'Postcode',
            visible: true,
        },
        {
            columnId: 'Status',
            columnName: 'Status',
            visible: true,
        },
        {
            columnId: 'OrgLink',
            columnName: 'Organisation Link',
            visible: false,
        },
        {
            columnId: 'OrgRecordClass',
            columnName: 'Organisation Record Class',
            visible: false,
        },
        {
            columnId: 'PrimaryRoleDescription',
            columnName: 'Primary Role Description',
            visible: false,
        },
        {
            columnId: 'PrimaryRoleId',
            columnName: 'Primary Role ID',
            visible: false,
        },
        {
            columnId: 'LastChangeDate',
            columnName: 'Last Change Date',
            visible: false,
        },
    ];

    public formGroup: FormGroup = this.fb.group({
        'OrgId': true,
        'Name': true,
        'PostCode': true,
        'Status': true,
        'OrgLink': false,
        'OrgRecordClass': false,
        'PrimaryRoleDescription': false,
        'PrimaryRoleId': false,
        'LastChangeDate': false,
    });
    public columnDropDown = new FormControl(['']);

    private url = 'https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PrimaryRoleId=RO177';

    constructor(
        private http: HttpClient,
        private fb: FormBuilder,
    ) {

    }

    public ngOnInit(): void {
        this.subscribeToData();
        this.setDropDownValues();
        this.refreshColumnDisplay();
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe())
    }

    public onSelectionChange(): void {
        this.refreshColumnDisplay();
    }

    private getData(): Observable<IOrganisations> {
        return this.http.get<IOrganisations>(`${this.url}`);
    }

    private refreshColumnDisplay(): void {
        this.displayedColumns = this.columnDropDown.value as string[];
    }

    private setDropDownValues(): void {
        const visibleColumns = this.columnConfig.filter(d => d.visible);
        const visibleColumnIds = visibleColumns.map(d => d.columnId);
        this.columnDropDown.setValue(visibleColumnIds);
    }

    private subscribeToData(): void {
        this.data$ = this.getData();
        const sub: Subscription = this.data$.subscribe((d: IOrganisations) => this.data = d);
        this.subscriptions.push(sub);
    }
}
