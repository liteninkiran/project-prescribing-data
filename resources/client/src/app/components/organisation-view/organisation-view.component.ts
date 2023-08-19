import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ISingleOrg } from 'src/app/interfaces/organisation.interfaces';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';

@Component({
    selector: 'app-organisation-view',
    templateUrl: './organisation-view.component.html',
    styleUrls: ['./organisation-view.component.scss'],
})
export class OrganisationViewComponent implements OnInit, OnDestroy {

    public id: string = '';
    public organisation: ISingleOrg = {} as ISingleOrg;
    public organisationObs: Observable<ISingleOrg> = new Observable();
    public organisationSub: Subscription = new Subscription();

    constructor(
        private route: ActivatedRoute,
        private orgService: OrganisationService,
    ) {

    }

    public ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.id = params.get('id') as string;
            this.organisationObs = this.orgService.getOrganisation(this.id);
            this.organisationSub = this.organisationObs.subscribe((org: ISingleOrg) => {
                this.organisation = org;
            });
        });
    }

    public ngOnDestroy(): void {
        this.organisationSub.unsubscribe();
    }
}
