import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IValidControl } from 'src/app/interfaces/organisation.interfaces';

@Component({
    selector: 'app-role-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
    public filterForm!: FormGroup;
    public _idInput: FormControl = new FormControl();
    public roleNameInput: FormControl = new FormControl();
    public primaryRoleInput: FormControl = new FormControl();

    constructor() { }

    public ngOnInit(): void {
        this.setFilterForm();
    }

    public onSubmitForm(): void {
        const allValues: Array<any> = Object.values(this.filterForm.value);
        const nonNullValues: Array<any> = allValues.filter((val) => val !== null);
        console.log(this.filterForm.value);
    }

    public filterFunction(t: any): boolean {
        return t.value !== null;
    }

    private setFilterForm() {
        this.setFilterInputs();
        this.setFilterFormGroup();
    }

    private setFilterInputs() {
        this._idInput = new FormControl(null);
        this.roleNameInput = new FormControl(null);
        this.primaryRoleInput = new FormControl(null);
    }

    private setFilterFormGroup() {
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
    }
}
