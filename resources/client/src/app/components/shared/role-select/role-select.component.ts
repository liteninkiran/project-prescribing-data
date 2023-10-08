import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { IMatSelectOptions } from 'src/app/interfaces/shared.interface';
import { OrganisationStore } from 'src/app/services/organisation/organisation.store';

@Component({
    selector: 'shared-role-select',
    templateUrl: './role-select.component.html',
    styleUrls: ['./role-select.component.scss'],
})
export class RoleSelectComponent {

    @Input() public control!: FormControl;

    public roles$!: Observable<IMatSelectOptions[]>;

    constructor(
        private orgStore: OrganisationStore,
    ) { }

    public ngOnInit(): void {
        this.loadReferenceData();
    }

    private loadReferenceData(): void {
        this.roles$ = this.orgStore.getRolesListByType(true);
    }
}
