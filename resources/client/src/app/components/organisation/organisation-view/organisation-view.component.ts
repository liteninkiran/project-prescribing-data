import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { IOrganisation } from 'src/app/interfaces/organisation.interface';
import { IMapData } from 'src/app/interfaces/shared.interface';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';

@Component({
    selector: 'app-organisation-view',
    templateUrl: './organisation-view.component.html',
    styleUrls: ['./organisation-view.component.scss'],
    providers: [OrganisationService],
})
export class OrganisationViewComponent implements OnInit, OnDestroy {
    public id: string = '';
    public organisation$: Observable<IOrganisation> = new Observable<IOrganisation>();
    public organisation: IOrganisation = {} as IOrganisation;
    public mapData: IMapData[] | undefined;
    public zoomSettings = {
        min: 10,
        max: 20,
        initial: 15,
        manual: true,
    }
    public mapOptions: L.MapOptions = {
        scrollWheelZoom: false,
        doubleClickZoom: false,
        dragging: false,
        zoomControl: false,
    }

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

    public onMarkerClick(data: IMapData) {
        alert(data.name);
    }

    private loadData(): void {
        this.organisation$ = this.orgService.loadOrganisation(this.id);
        const sub: Subscription = this.organisation$.subscribe((res: IOrganisation) => {
            this.organisation = res;
            this.mapData = [];
            this.mapData?.push({
                id: res.id,
                icon: res.primary_role.icon || null,
                icon_name: res.primary_role.display_name,
                lat: res.postcode?.latitude || null,
                long: res.postcode?.longitude || null,
                code: res.org_id,
                name: res.name,
                postcode: res.post_code,
                tooltipText: 'Tooltip',
            });
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
