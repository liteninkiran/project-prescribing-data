import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { IOrganisationFilterFormGroup } from 'src/app/interfaces/organisation.interface';
import { IRole } from 'src/app/interfaces/role.interface';
import { IFilterConfig } from 'src/app/interfaces/shared.interface';
import { OrganisationStore } from 'src/app/services/organisation/organisation.store';

@Component({
    selector: 'app-organisation-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class OrganisationFiltersComponent {

    @Output() public filtersChanged = new EventEmitter<any>();

    // Form
    public filterForm!: FormGroup;

    // Form Controls
    public nameInput: FormControl = new FormControl()
    public primaryRoleInput: FormControl = new FormControl(['']); // Must be array because multiple=true
    public nonPrimaryRoleInput: FormControl = new FormControl(['']); // Must be array because multiple=true

    // Config
    // public filters: IFilterConfig[] = [];
    public filterText: string = '';

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

    private loadData(): void {
        this.primaryRoles$ = this.orgStore.getRolesListByType(true);
        this.nonPrimaryRoles$ = this.orgStore.getRolesListByType(false);
    }

    private setFilterForm(): void {
        this.setFilterFormGroup();
    }

    private setFilterFormGroup(): void {
        const formGroup: IOrganisationFilterFormGroup = {
            'name': this.nameInput,
            'primaryRoles': this.primaryRoleInput,
            'nonPrimaryRoles': this.nonPrimaryRoleInput,
        }

        this.filterForm = new FormGroup(formGroup);

        this.filterForm.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap((value: any) => {
                this.calculateFilter(value);
                this.filtersChanged.emit(value);
                // console.log('Value', value);
            })
        ).subscribe();
    }

    private calculateFilter(value: any): void {
        // this.filters = [];
        // Object.keys(value).map((key) => {
        //     if (value[key]) {
        //         this.filters.push({ field: key, value: value[key]});
        //     }
        // });
        // const suffix = this.filters.length === 1 ? '' : 's';
        // this.filterText = this.filters.length === 0 ? '' : this.filters.length + ' Filter' + suffix + ' Applied';
        // console.log('Filters', this.filters);
        //console.log(this.filterForm.value); //.filter((x: any) => !!x));
    }
}
