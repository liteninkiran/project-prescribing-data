import { Component } from '@angular/core';
import { ICheckboxMenuItem } from 'src/app/interfaces/shared.interface';

@Component({
    selector: 'sample-checkbox-menu',
    templateUrl: './checkbox-menu.component.html',
    styleUrls: ['./checkbox-menu.component.scss'],
})
export class CheckboxMenuComponent {
    public items: ICheckboxMenuItem[] = [
        { value: 'id', title: 'ID', activated: false },
        { value: 'org_id', title: 'Organisation ID', activated: true },
        { value: 'org_name', title: 'Organisation Name', activated: true },
        { value: 'postcode', title: 'Postcode', activated: true },
        { value: 'primary_role_description', title: 'Primary Role', activated: true },
    ];
}
