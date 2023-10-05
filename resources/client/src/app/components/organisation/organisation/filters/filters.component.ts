import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { IOrganisationFilterFormGroup, IOrganisationFilters, IOrganisationStatus } from 'src/app/interfaces/organisation.interface';
import { IRole } from 'src/app/interfaces/role.interface';
import { IFilterConfig, IMatSelectOptions } from 'src/app/interfaces/shared.interface';
import { OrganisationStore } from 'src/app/services/organisation/organisation.store';
import { PostcodeStore } from 'src/app/services/postcode/postcode.store';

@Component({
    selector: 'app-organisation-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
})
export class OrganisationFiltersComponent {

    @Input() public message: string = '';
    @Input() public defaultFilters: IOrganisationFilters = { } as IOrganisationFilters;

    @Output() public filtersChanged = new EventEmitter<IOrganisationFilters>();

    // Form
    public filterForm!: FormGroup;

    // Form Controls
    public filterFormControls: any;

    // Config
    public appliedFilters: IFilterConfig[] = [];
    public filterText: string = '';
    public maxDate: Date = new Date();
    public status: IOrganisationStatus[] = [];

    // Reference Data
    public primaryRoles$!: Observable<IRole[]>;
    public nonPrimaryRoles$!: Observable<IRole[]>;
    public adminCounty$!: Observable<IMatSelectOptions[]>;
    public adminDistrict$!: Observable<IMatSelectOptions[]>;
    public parliamentaryConstituency$!: Observable<IMatSelectOptions[]>;
    public policeForceArea$!: Observable<IMatSelectOptions[]>;
    public nuts$!: Observable<IMatSelectOptions[]>;
    public postcodeArea$!: Observable<IMatSelectOptions[]>;
    public europeanElectoralRegion$!: Observable<IMatSelectOptions[]>;
    public healthAuthority$!: Observable<IMatSelectOptions[]>;
    public primaryCareTrust$!: Observable<IMatSelectOptions[]>;
    public region$!: Observable<IMatSelectOptions[]>;
    public country$!: Observable<IMatSelectOptions[]>;

    constructor(
        private orgStore: OrganisationStore,
        private postcodeStore: PostcodeStore,
        private router: Router,
    ) { }

    public ngOnInit(): void {
        this.setStatusData();
        this.setFilterFormGroup();
        this.loadReferenceData();
        this.calculateFilter(this.filterForm.value);
        this.filtersChanged.emit(this.filterForm.value);
    }

    public onPostcodeInput(event: Event): void {
        this.changeToUpperCase(this.filterFormControls.postcode);
    }

    public onorganisationIdInput(event: Event): void {
        this.changeToUpperCase(this.filterFormControls.organisationId);
    }

    private changeToUpperCase(input: any) {
        if (input.value) {
            input.setValue(input.value.toUpperCase());
        }
    }

    private loadReferenceData(): void {
        this.primaryRoles$ = this.orgStore.getRolesListByType(true);
        this.nonPrimaryRoles$ = this.orgStore.getRolesListByType(false);
        this.adminCounty$ = this.postcodeStore.getAdminCounties();
        this.adminDistrict$ = this.postcodeStore.getAdminDistricts();
        this.parliamentaryConstituency$ = this.postcodeStore.getParliamentaryConstituencies();
        this.policeForceArea$ = this.postcodeStore.getPoliceForceAreas();
        this.nuts$ = this.postcodeStore.getNuts();
        this.postcodeArea$ = this.postcodeStore.getPostcodeArea();
        this.europeanElectoralRegion$ = this.postcodeStore.getEuropeanElectoralRegion();
        this.healthAuthority$ = this.postcodeStore.getHealthAuthority();
        this.primaryCareTrust$ = this.postcodeStore.getPrimaryCareTrust();
        this.region$ = this.postcodeStore.getRegion();
        this.country$ = this.postcodeStore.getCountry();
    }

    private setFilterFormGroup(): void {
        this.filterFormControls = this.getFilterFormControls();
        this.filterForm = new FormGroup(this.filterFormControls);
        this.filterForm.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap((value: IOrganisationFilters) => {
                this.calculateFilter(value);
                this.filtersChanged.emit(value);
            })
        ).subscribe();
    }

    private calculateFilter(value: IOrganisationFilters): void {
        this.appliedFilters = [];
        Object.keys(value).map((key) => {
            if (value[key as keyof IOrganisationFilters] !== null) {
                this.appliedFilters.push({ field: key, value: value[key as keyof IOrganisationFilters]});
            }
        });
        const suffix = this.appliedFilters.length === 1 ? '' : 's';
        this.filterText = this.appliedFilters.length === 0 ? '' : this.appliedFilters.length + ' Filter' + suffix + ' Applied';
    }

    private setStatusData(): void {
        this.status = this.statusData();
    }

    private statusData(): IOrganisationStatus[] {
        return [
            { id: 0, displayName: 'Active' },
            { id: 1, displayName: 'Inactive' },
        ];
    }

    private getFilterFormControls(): IOrganisationFilterFormGroup {
        this.addQueryParamsToFilters();
        return {
            organisationId              : new FormControl(this.defaultFilters.organisationId),
            name                        : new FormControl(this.defaultFilters.name),
            status                      : new FormControl(this.defaultFilters.status),
            primaryRoles                : new FormControl(this.defaultFilters.primaryRoles),
            nonPrimaryRoles             : new FormControl({ value: this.defaultFilters.nonPrimaryRoles, disabled: true }),
            lastChangeDate              : new FormControl(this.defaultFilters.lastChangeDate),
            postcode                    : new FormControl(this.defaultFilters.postcode),
            adminCounty                 : new FormControl(this.defaultFilters.adminCounty),
            adminDistrict               : new FormControl(this.defaultFilters.adminDistrict),
            parliamentaryConstituency   : new FormControl(this.defaultFilters.parliamentaryConstituency),
            policeForceArea             : new FormControl(this.defaultFilters.policeForceArea),
            nuts                        : new FormControl(this.defaultFilters.nuts),
            postcodeArea                : new FormControl(this.defaultFilters.postcodeArea),
            europeanElectoralRegion     : new FormControl(this.defaultFilters.europeanElectoralRegion),
            healthAuthority             : new FormControl(this.defaultFilters.healthAuthority),
            primaryCareTrust            : new FormControl(this.defaultFilters.primaryCareTrust),
            region                      : new FormControl(this.defaultFilters.region),
            country                     : new FormControl(this.defaultFilters.country),
        }
    }

    private addQueryParamsToFilters(): void {
        let roles = this.router.parseUrl(this.router.url).queryParams['roles'];
        if (roles) {
            roles = Array.isArray(roles) ? roles.map(Number) : [+roles];
            this.defaultFilters.primaryRoles = roles.concat(this.defaultFilters.primaryRoles ?? []);
        }
    }
}
