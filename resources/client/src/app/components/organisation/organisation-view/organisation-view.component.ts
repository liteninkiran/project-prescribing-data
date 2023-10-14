import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { IOrganisation } from 'src/app/interfaces/organisation.interface';
import { IAsyncButtonInputConfig, IMapData, IMatTableColumnConfig, IPaginatorConfig } from 'src/app/interfaces/shared.interface';
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
    public statusInput: any;
    public id: string = '';
    public organisations$: Observable<IOrganisation[]> = new Observable<IOrganisation[]>();
    public organisations: IOrganisation[] = [];
    public organisation!: IOrganisation;
    public centreCoords!: L.LatLngExpression;
    public mapData: IMapData[] | undefined;
    public zoomSettings = {
        min: 10,
        max: 20,
        initial: 15,
        manual: true,
    }
    public mapOptions: L.MapOptions = {
        wheelDebounceTime: 100,
        scrollWheelZoom: 'center',
        doubleClickZoom: 'center',
        zoomControl: true,
        dragging: false,
        keyboard: false,
        boxZoom: false,
    }
    public defaultIcon = defaultIcon;
    public columnConfig: IMatTableColumnConfig[] = [
        { columnId: 'org_id', columnName: 'Organisation ID', visible: true },
        { columnId: 'name', columnName: 'Organisation Name', visible: true },
        { columnId: 'post_code', columnName: 'Postcode', visible: true },
        { columnId: 'primary_role', columnName: 'Primary Role', visible: true, property: 'display_name' },
        { columnId: 'status', columnName: 'Status', visible: true },
        { columnId: 'org_record_class', columnName: 'Record Class', visible: false },
        { columnId: 'last_change_date', columnName: 'Last Change Date', visible: false },
        { columnId: 'org_link', columnName: 'API Link', visible: false },
        { columnId: 'created_at', columnName: 'Created At', visible: false },
        { columnId: 'updated_at', columnName: 'Updated At', visible: false },
    ];
    public actionButtonConfig: IAsyncButtonInputConfig = {
        buttonText: '',
        colour: 'primary',
        icon: 'visibility',
        loaded: true,
        hide: true,
        hideRow: 'primary_role',
    }
    public paginatorConfig: IPaginatorConfig = {
        pageSizeOptions: [],
        intialPageSize: 100,
        showFirstLastButtons: false,
        hidePageSize: true,
        disabled: true,
    }

    private subscriptions: Subscription[] = [];
    private radius: number = 0;

    constructor(
        private route: ActivatedRoute,
        readonly orgService: OrganisationService,
    ) {

    }

    public ngOnInit(): void {
        this.setForm();
        this.setId();
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe())
    }

    public onMarkerClick(data: IMapData): void {

    }

    public onManualZoom(radius: number): void {
        this.radius = radius;
        if (this.primaryRolesInput.value) {
            this.loadData();
        }
    }

    private loadData(): void {
        this.organisations$ = this.orgService.loadOrganisationData(this.id, this.form.value, this.radius);
        const sub: Subscription = this.organisations$.subscribe((res: IOrganisation[]) => {
            this.organisations = res;
            this.organisation = res.find((org) => org.org_id === this.id) as IOrganisation;
            this.centreCoords = [this.organisation.postcode?.latitude || 0, this.organisation.postcode?.longitude || 0] as L.LatLngExpression;
            this.mapData = undefined;
            this.mapData = res.map((org) => {
                return {
                    id: org.id,
                    icon: org.primary_role.icon || null,
                    icon_name: org.primary_role.display_name,
                    lat: org.postcode?.latitude || null,
                    long: org.postcode?.longitude || null,
                    code: org.org_id,
                    name: org.name,
                    postcode: org.post_code,
                    tooltipText: this.getTooltipText(org),
                }
            });
            this.organisations.splice(0, 1);
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
            status: this.statusInput = new FormControl(0) as FormControl<number[] | null>,
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
        this.loadData();
    }
}
