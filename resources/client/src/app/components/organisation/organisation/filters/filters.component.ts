import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { IValidControl } from 'src/app/interfaces/organisation.interfaces';
import { IFilterConfig } from 'src/app/interfaces/shared.interface';

@Component({
    selector: 'app-organisation-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
})
export class OrganisationFiltersComponent {

    @Output() public filtersChanged = new EventEmitter<any>();
  
    public filterForm!: FormGroup;
    public nameInput: FormControl = new FormControl();
    public primaryRoleInput: FormControl = new FormControl(['']); // Must be array because multiple=true
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
        this.nameInput = new FormControl(null);
    }

    private setFilterFormGroup(): void {
        const requireOneControl = () => {
            return (formGroup: any) => {
                const err = { atLeastOneRequired: 'Please apply one or more filters' };
                const validControls: IValidControl[] = [
                    { name: 'name', hasValue: formGroup.get('name').value !== null },
                ];
                const valid = validControls.filter((ctl: IValidControl) => ctl.hasValue).length > 0;
                return valid ? null : err;
            }
        }

        const formGroup: any = {
            'name': this.nameInput,
        }

        this.filterForm = new FormGroup(formGroup, requireOneControl());

        this.filterForm.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap((value: any) => {
                this.calculateFilter(value);
                this.filtersChanged.emit(value);
            })
        ).subscribe();
    }

    private calculateFilter(value: any): void {
        this.filters = [];
        Object.keys(value).map((key) => {
            if (value[key]) {
                this.filters.push({ field: key, value: value[key]});
            }
        });
        const suffix = this.filters.length === 1 ? '' : 's';
        this.filterText = this.filters.length === 0 ? '' : this.filters.length + ' Filter' + suffix + ' Applied';
    }
}
