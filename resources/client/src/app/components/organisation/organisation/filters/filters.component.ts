import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { IOrganisationFilterFormGroup, IOrganisationFilters } from 'src/app/interfaces/organisation.interface';
import { IRole } from 'src/app/interfaces/role.interface';
import { IFilterConfig } from 'src/app/interfaces/shared.interface';
import { OrganisationStore } from 'src/app/services/organisation/organisation.store';

@Component({
    selector: 'app-organisation-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
})
export class OrganisationFiltersComponent {

    @Output() public filtersChanged = new EventEmitter<IOrganisationFilters>();

    // Form
    public filterForm!: FormGroup;

    // Form Controls
    public internalIdInput    : FormControl<string   | null> = new FormControl(null)
    public nameInput          : FormControl<string   | null> = new FormControl(null)
    public postcodeInput      : FormControl<string   | null> = new FormControl(null);
    public primaryRoleInput   : FormControl<number[] | null> = new FormControl(null);
    public nonPrimaryRoleInput: FormControl<number[] | null> = new FormControl({ value: null, disabled: true });
    public lastChangeDateInput: FormControl<Date     | null> = new FormControl(null);

    // Config
    public filters: IFilterConfig[] = [];
    public filterText: string = '';
    public maxDate: Date = new Date();

    // Data
    public primaryRoles$!: Observable<IRole[]>;
    public nonPrimaryRoles$!: Observable<IRole[]>;

    constructor(
        private orgStore: OrganisationStore,
    ) { }

    public ngOnInit(): void {
        this.setFilterForm();
        this.loadData();
    }

    public onPostcodeInput(event: Event): void {
        this.changeToUpperCase(this.postcodeInput);
    }

    public onInternalIdInput(event: Event): void {
        this.changeToUpperCase(this.internalIdInput);
    }

    private changeToUpperCase(input: any) {
        if (input.value) {
            input.setValue(input.value.toUpperCase());
        }
    }

    private loadData(): void {
        this.primaryRoles$ = this.orgStore.getRolesListByType(true);
        this.nonPrimaryRoles$ = this.orgStore.getRolesListByType(false);
    }

    private setFilterForm(): void {
        this.setFilterFormGroup();
    }

    private setFilterFormGroup(): void {
        const formGroup: IOrganisationFilterFormGroup = {
            internalId: this.internalIdInput,
            name: this.nameInput,
            postcode: this.postcodeInput,
            primaryRoles: this.primaryRoleInput,
            nonPrimaryRoles: this.nonPrimaryRoleInput,
            lastChangeDate: this.lastChangeDateInput,
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
}
