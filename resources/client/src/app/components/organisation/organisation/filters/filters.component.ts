import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { IOrganisationFilterFormGroup, IOrganisationFilters, IOrganisationStatus } from 'src/app/interfaces/organisation.interface';
import { IPostcodeAttribute } from 'src/app/interfaces/postcode.interface';
import { IRole } from 'src/app/interfaces/role.interface';
import { IFilterConfig } from 'src/app/interfaces/shared.interface';
import { OrganisationStore } from 'src/app/services/organisation/organisation.store';
import { PostcodeStore } from 'src/app/services/postcode/postcode.store';

@Component({
    selector: 'app-organisation-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
})
export class OrganisationFiltersComponent {

    @Input() public message: string = '';

    @Output() public filtersChanged = new EventEmitter<IOrganisationFilters>();

    // Form
    public filterForm!: FormGroup;

    // Form Controls
    public organisationIdInput : FormControl<string   | null> = new FormControl(null)
    public nameInput           : FormControl<string   | null> = new FormControl(null)
    public statusInput         : FormControl<number   | null> = new FormControl(0);
    public primaryRoleInput    : FormControl<number[] | null> = new FormControl(null);
    public nonPrimaryRoleInput : FormControl<number[] | null> = new FormControl({ value: null, disabled: true });
    public lastChangeDateInput : FormControl<Date     | null> = new FormControl(null);
    public postcodeInput       : FormControl<string   | null> = new FormControl(null);
    public adminCountyInput    : FormControl<number[] | null> = new FormControl(null);
    public adminDistrictInput  : FormControl<number[] | null> = new FormControl(null);
    public parliamentInput     : FormControl<number[] | null> = new FormControl(null);
    public policeForceAreaInput: FormControl<number[] | null> = new FormControl(null);
    public nutsInput           : FormControl<number[] | null> = new FormControl(null);
    public euroInput           : FormControl<number[] | null> = new FormControl(null);
    public nhsHaInput          : FormControl<number[] | null> = new FormControl(null);
    public priCareTrustInput   : FormControl<number[] | null> = new FormControl(null);
    public regionInput         : FormControl<number[] | null> = new FormControl(null);
    public countryInput        : FormControl<number[] | null> = new FormControl(null);

    // Config
    public filters: IFilterConfig[] = [];
    public filterText: string = '';
    public maxDate: Date = new Date();
    public status: IOrganisationStatus[] = [];

    // Reference Data
    public primaryRoles$!: Observable<IRole[]>;
    public nonPrimaryRoles$!: Observable<IRole[]>;
    public adminCounty$!: Observable<IPostcodeAttribute[]>;
    public adminDistrict$!: Observable<IPostcodeAttribute[]>;
    public parliamentaryConstituency$!: Observable<IPostcodeAttribute[]>;
    public policeForceArea$!: Observable<IPostcodeAttribute[]>;
    public nuts$!: Observable<IPostcodeAttribute[]>;
    public euro$!: Observable<IPostcodeAttribute[]>;
    public healthAuthority$!: Observable<IPostcodeAttribute[]>;
    public primaryCareTrust$!: Observable<IPostcodeAttribute[]>;
    public region$!: Observable<IPostcodeAttribute[]>;
    public country$!: Observable<IPostcodeAttribute[]>;

    constructor(
        private orgStore: OrganisationStore,
        private postcodeStore: PostcodeStore,
    ) { }

    public ngOnInit(): void {
        this.loadReferenceData();
        this.setStatusData();
        this.setFilterFormGroup();
        this.calculateFilter(this.filterForm.value);
        this.filtersChanged.emit(this.filterForm.value);
    }

    public onPostcodeInput(event: Event): void {
        this.changeToUpperCase(this.postcodeInput);
    }

    public onorganisationIdInput(event: Event): void {
        this.changeToUpperCase(this.organisationIdInput);
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
        this.euro$ = this.postcodeStore.getEuropeanElectoralRegion();
        this.healthAuthority$ = this.postcodeStore.getHealthAuthority();
        this.primaryCareTrust$ = this.postcodeStore.getPrimaryCareTrust();
        this.region$ = this.postcodeStore.getRegion();
        this.country$ = this.postcodeStore.getCountry();
    }

    private setFilterFormGroup(): void {
        const formGroup: IOrganisationFilterFormGroup = {
            organisationId: this.organisationIdInput,
            name: this.nameInput,
            status: this.statusInput,
            primaryRoles: this.primaryRoleInput,
            nonPrimaryRoles: this.nonPrimaryRoleInput,
            lastChangeDate: this.lastChangeDateInput,
            postcode: this.postcodeInput,
            adminCounty: this.adminCountyInput,
            adminDistrict: this.adminDistrictInput,
            parliamentaryConstituency: this.parliamentInput,
            policeForceArea: this.policeForceAreaInput,
            nuts: this.nutsInput,
            europeanElectoralRegion: this.euroInput,
            healthAuthority: this.nhsHaInput,
            primaryCareTrust: this.priCareTrustInput,
            region: this.regionInput,
            country: this.countryInput,
        }

        this.filterForm = new FormGroup(formGroup);

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
            if (value[key as keyof IOrganisationFilters]) {
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
}
