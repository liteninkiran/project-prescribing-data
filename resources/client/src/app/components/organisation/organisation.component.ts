import { Component, Input } from '@angular/core';
import { IOrganisations } from 'src/app/interfaces/organisation.interfaces';

@Component({
    selector: 'app-organisation',
    templateUrl: './organisation.component.html',
    styleUrls: ['./organisation.component.scss'],
})
export class OrganisationComponent {

    @Input() data: IOrganisations | null = null;

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
}
