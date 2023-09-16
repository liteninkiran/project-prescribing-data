import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { IValidControl } from 'src/app/interfaces/organisation.interfaces';

@Component({
    selector: 'app-role-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {

    @Output() public filtersChanged = new EventEmitter<Array<any>>();
  
    public filterForm!: FormGroup;
    public _idInput: FormControl = new FormControl();
    public roleNameInput: FormControl = new FormControl();
    public primaryRoleInput: FormControl = new FormControl();
    public filterText: string = '';
    public filterValues: Array<any> = [];

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

        this.filterForm = new FormGroup({
            '_id': this._idInput,
            'roleName': this.roleNameInput,
            'primaryRole': this.primaryRoleInput,
        }, requireOneControl());

        this.filterForm.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap((value: any) => {
                this.calculateFilter(value);
                this.filtersChanged.emit(this.filterValues);
            })
        ).subscribe();
    }

    private calculateFilter(value: any): void {
        this.filterValues = Object.values(value).filter((val) => val !== null);
        const suffix = this.filterValues.length === 1 ? '' : 's';
        this.filterText = this.filterValues.length === 0 ? '' : this.filterValues.length + ' Filter' + suffix + ' Applied';
    }
}
