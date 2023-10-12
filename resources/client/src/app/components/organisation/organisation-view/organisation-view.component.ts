import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { IOrganisation } from 'src/app/interfaces/organisation.interface';
import { IMapData } from 'src/app/interfaces/shared.interface';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { defaultIcon } from 'src/app/components/shared/map/map.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-organisation-view',
    templateUrl: './organisation-view.component.html',
    styleUrls: ['./organisation-view.component.scss'],
    providers: [OrganisationService],
})
export class OrganisationViewComponent implements OnInit, OnDestroy {
    public form!: FormGroup;
    public primaryRolesInput: any;
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
        this.setForm();
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe())
    }

    public onMarkerClick(data: IMapData): void {

    }

    public onManualZoom(bounds: L.LatLngBounds): void {
        // TODO Make new request to back-end with bounds
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
                tooltipText: this.getTooltipText(res),
            });
        });
        this.subscriptions.push(sub);
    }

    private setId(): void {
        this.route.paramMap.subscribe(params => {
            this.id = params.get('id') as string;
            this.loadData();
        });
    }

    private getTooltipText(org: IOrganisation): string {
        return `
            <div>
                <div style="display: flex;">
                    <div style="margin-right: 15px;">
                        <img style="display: inline-block; height: 40px; width: 40px; margin-top: 4px;" src="${org.primary_role.icon || defaultIcon.iconUrl}">
                    </div>
                    <div style="text-align: left; min-width: 200px; display: flex; align-items: center;">
                        <h2 style="margin-top: 0; margin-bottom: 0; white-space: normal; color: royalblue;">${org.primary_role.display_name}</h2>
                    </div>
                </div>
                <div style="white-space: normal;">
                <h3>${org.name} - ${org.org_id}</h3>
                </div>
                
                <p>${org.post_code}</p>
            </div>
        `;
    }

    private setForm(): void {
        this.form = new FormGroup({
            primaryRoles: this.primaryRolesInput = new FormControl(null) as FormControl<number[] | null>,
        });

        this.primaryRolesInput.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap((value: number[] | null) => {
                this.roleInputChanged(value);
            })
        ).subscribe();
    }

    private roleInputChanged(value: number[] | null): void {
        console.log(value, this.organisation);
    }
}
