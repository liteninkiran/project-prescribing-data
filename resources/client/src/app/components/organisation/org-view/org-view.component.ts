import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { IOrganisation } from 'src/app/interfaces/organisation.interface';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';

@Component({
    selector: 'app-org-view',
    templateUrl: './org-view.component.html',
    styleUrls: ['./org-view.component.scss'],
    providers: [OrganisationService],
})
export class OrgViewComponent implements OnInit, OnDestroy {
    public id: string = '';
    public organisation$: Observable<IOrganisation> = new Observable<IOrganisation>();
    public organisation: IOrganisation = {} as IOrganisation;

    private subscriptions: Subscription[] = [];

    constructor(
        private route: ActivatedRoute,
        readonly orgService: OrganisationService,
    ) {

    }

    public ngOnInit(): void {
        this.setId();
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe())
    }

    private loadData(): void {
        this.organisation$ = this.orgService.loadOrganisation(this.id);
        const sub: Subscription = this.organisation$.subscribe((res: IOrganisation) => {
            this.organisation = res;
            console.log(this.organisation);
        });
        this.subscriptions.push(sub);
    }

    private setId() {
        this.route.paramMap.subscribe(params => {
            this.id = params.get('id') as string;
            this.loadData();
        });
    }
}
