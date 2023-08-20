import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ISingleOrg, ISingleOrgResponse, ISingleOrgRoleCount } from 'src/app/interfaces/organisation.interfaces';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';

@Component({
    selector: 'app-organisation-view',
    templateUrl: './organisation-view.component.html',
    styleUrls: ['./organisation-view.component.scss'],
})
export class OrganisationViewComponent implements OnInit, OnDestroy {

    public id: string = '';
    public organisation: ISingleOrg = {} as ISingleOrg;
    public organisationObs: Observable<ISingleOrgResponse> = new Observable();
    public organisationSub: Subscription = new Subscription();
    public roleCount: ISingleOrgRoleCount = {} as ISingleOrgRoleCount;

    constructor(
        private route: ActivatedRoute,
        private orgService: OrganisationService,
    ) {

    }

    public ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.id = params.get('id') as string;
            this.organisationObs = this.orgService.getOrganisation(this.id);
            this.organisationSub = this.organisationObs.subscribe((res: ISingleOrgResponse) => {
                this.organisation = res.Organisation;
                this.setLastChangeDate();
                this.setRoleCount();
            });
        });
    }

    public ngOnDestroy(): void {
        this.organisationSub.unsubscribe();
    }

    private setLastChangeDate() {
        this.organisation.LastChangeDt = new Date(this.organisation.LastChangeDate);
        this.organisation.LastChangeDate = this.organisation.LastChangeDt.toLocaleDateString('en-GB');
    }

    private setRoleCount() {
        this.roleCount.Active = this.organisation.Roles.Role.filter(x => x.Status === 'Active').length;
        this.roleCount.Inactive = this.organisation.Roles.Role.filter(x => x.Status === 'Inactive').length;
        this.roleCount.total = this.roleCount.Active + this.roleCount.Inactive;
        this.roleCount.view = this.roleCount[this.organisation.Status as keyof ISingleOrgRoleCount];
    }
}
