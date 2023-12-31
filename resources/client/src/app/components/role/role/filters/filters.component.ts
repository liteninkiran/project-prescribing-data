import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { IRoleFilterFormGroup, IRoleFilters } from 'src/app/interfaces/role.interface';
import { IFilterConfig } from 'src/app/interfaces/shared.interface';

@Component({
    selector: 'app-role-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
})
export class RoleFiltersComponent {

    @Output() public filtersChanged = new EventEmitter<any>();

    // Form
    public filterForm!: FormGroup;

    // Form Controls
    public _idInput        : FormControl<string | null> = new FormControl(null);
    public roleNameInput   : FormControl<string | null> = new FormControl(null);
    public primaryRoleInput: FormControl<string | null> = new FormControl('true');

    // Config
    public filters: IFilterConfig[] = [];
    public filterText: string = '';

    constructor() { }

    public ngOnInit(): void {
        this.setFilterForm();
    }

    private setFilterForm(): void {
        this.setFilterFormGroup();
        this.calculateFilter(this.filterForm.value);
        this.filtersChanged.emit(this.filterForm.value);
    }

    private setFilterFormGroup(): void {
        const formGroup: IRoleFilterFormGroup = {
            _id: this._idInput,
            roleName: this.roleNameInput,
            primaryRole: this.primaryRoleInput,
        }

        this.filterForm = new FormGroup(formGroup);

        this.filterForm.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap((value: IRoleFilters) => {
                this.calculateFilter(value);
                this.filtersChanged.emit(value);
            })
        ).subscribe();
    }

    private calculateFilter(value: IRoleFilters): void {
        this.filters = [];
        Object.keys(value).map((key) => {
            if (value[key as keyof IRoleFilters]) {
                this.filters.push({ field: key, value: value[key as keyof IRoleFilters]});
            }
        });
        const suffix = this.filters.length === 1 ? '' : 's';
        this.filterText = this.filters.length === 0 ? '' : this.filters.length + ' Filter' + suffix + ' Applied';
    }
}
