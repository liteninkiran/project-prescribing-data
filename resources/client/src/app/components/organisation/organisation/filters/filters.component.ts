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
    @Input() public defaultFilterValues: IOrganisationFilters = { } as IOrganisationFilters;

    @Output() public filtersChanged = new EventEmitter<IOrganisationFilters>();

    // Form
    public filterForm!: FormGroup;

    // Form Controls
    public filterFormControls: any;

    // Config
    public filters: IFilterConfig[] = [];
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
        this.filters = [];
        Object.keys(value).map((key) => {
            if (value[key as keyof IOrganisationFilters] !== null) {
                this.filters.push({ field: key, value: value[key as keyof IOrganisationFilters]});
            }
        });
        const suffix = this.filters.length === 1 ? '' : 's';
        this.filterText = this.filters.length === 0 ? '' : this.filters.length + ' Filter' + suffix + ' Applied';
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
        const roleId: number = this.router.parseUrl(this.router.url).queryParams['role'];
        if (roleId) {
            if (this.defaultFilterValues.primaryRoles) {
                this.defaultFilterValues.primaryRoles.push(roleId);
            } else {
                this.defaultFilterValues.primaryRoles = [roleId];
            }
        }
        return {
            organisationId              : new FormControl(this.defaultFilterValues.organisationId),
            name                        : new FormControl(this.defaultFilterValues.name),
            status                      : new FormControl(this.defaultFilterValues.status),
            primaryRoles                : new FormControl(this.defaultFilterValues.primaryRoles),
            nonPrimaryRoles             : new FormControl({ value: this.defaultFilterValues.nonPrimaryRoles, disabled: true }),
            lastChangeDate              : new FormControl(this.defaultFilterValues.lastChangeDate),
            postcode                    : new FormControl(this.defaultFilterValues.postcode),
            adminCounty                 : new FormControl(this.defaultFilterValues.adminCounty),
            adminDistrict               : new FormControl(this.defaultFilterValues.adminDistrict),
            parliamentaryConstituency   : new FormControl(this.defaultFilterValues.parliamentaryConstituency),
            policeForceArea             : new FormControl(this.defaultFilterValues.policeForceArea),
            nuts                        : new FormControl(this.defaultFilterValues.nuts),
            postcodeArea                : new FormControl(this.defaultFilterValues.postcodeArea),
            europeanElectoralRegion     : new FormControl(this.defaultFilterValues.europeanElectoralRegion),
            healthAuthority             : new FormControl(this.defaultFilterValues.healthAuthority),
            primaryCareTrust            : new FormControl(this.defaultFilterValues.primaryCareTrust),
            region                      : new FormControl(this.defaultFilterValues.region),
            country                     : new FormControl(this.defaultFilterValues.country),
        }
    }
}
