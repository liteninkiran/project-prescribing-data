import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-role-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
    public filterForm!: FormGroup;
    public roleNameInput: FormControl = new FormControl();
    public primaryRoleInput: FormControl = new FormControl();

    constructor(
        private fb: FormBuilder,
    ) { }

    public ngOnInit(): void {
        this.roleNameInput = new FormControl(null);
        this.primaryRoleInput = new FormControl('');
        this.filterForm = new FormGroup({
            'roleName': this.roleNameInput,
            'primaryRole': this.primaryRoleInput,
        });

    }

    public onSubmitForm(): void {
        
    }
}
