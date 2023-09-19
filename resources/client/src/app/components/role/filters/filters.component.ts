import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { IValidControl } from 'src/app/interfaces/organisation.interfaces';
import { IRoleFilterFormGroup, IRoleFilters } from 'src/app/interfaces/organisation2.interfaces';
import { IFilterConfig } from 'src/app/interfaces/shared.interface';

@Component({
    selector: 'app-role-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
})
export class RoleFiltersComponent {

    @Output() public filtersChanged = new EventEmitter<any>();
  
    public filterForm!: FormGroup;
    public _idInput: FormControl = new FormControl();
    public roleNameInput: FormControl = new FormControl();
    public primaryRoleInput: FormControl = new FormControl();
    public filters: IFilterConfig[] = [];
    public filterText: string = '';

    constructor() { }

    public ngOnInit(): void {
        this.setFilterForm();
    }

    private setFilterForm(): void {
        this.setFilterInputs();
        this.setFilterFormGroup();
    }

    private setFilterInputs(): void {
        this._idInput = new FormControl(null);
        this.roleNameInput = new FormControl(null);
        this.primaryRoleInput = new FormControl(null);
    }

    private setFilterFormGroup(): void {
        const requireOneControl = () => {
            return (formGroup: any) => {
                const err = { atLeastOneRequired: 'Please apply one or more filters' };
                const validControls: IValidControl[] = [
                    { name: '_id', hasValue: formGroup.get('_id').value !== null },
                    { name: 'roleName', hasValue: formGroup.get('roleName').value !== null },
                    { name: 'primaryRole', hasValue: formGroup.get('primaryRole').value !== null },
                ];
                const valid = validControls.filter((ctl: IValidControl) => ctl.hasValue).length > 0;
                return valid ? null : err;
            }
        }

        const formGroup: IRoleFilterFormGroup = {
            '_id': this._idInput,
            'roleName': this.roleNameInput,
            'primaryRole': this.primaryRoleInput,
        }

        this.filterForm = new FormGroup(formGroup, requireOneControl());

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
