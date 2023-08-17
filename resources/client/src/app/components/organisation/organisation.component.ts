import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { IColumnConfig, INumInputConfig, IOrganisations, IStatus, IStatusConfig } from 'src/app/interfaces/organisation.interfaces';
import { Observable, Subscription } from 'rxjs';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-organisation',
    templateUrl: './organisation.component.html',
    styleUrls: ['./organisation.component.scss'],
    providers: [OrganisationService],
    encapsulation: ViewEncapsulation.None,
})
export class OrganisationComponent implements OnInit, OnDestroy {

    // Data
    public data$: Observable<IOrganisations> = new Observable();
    public data: IOrganisations | null = null;
    public subscriptions: Subscription[] = [];

    // Form
    public form!: FormGroup;
    public columnDropDown: FormControl = new FormControl(['']);          // Must be array because multiple=true
    public offsetInput: FormControl = new FormControl();
    public limitInput: FormControl = new FormControl();
    public statusInput: FormControl = new FormControl();

    // Configuration
    public displayedColumns: string[] = [];
    public columnConfig: IColumnConfig[] = [];
    public offsetConfig: INumInputConfig = {} as INumInputConfig;
    public limitConfig: INumInputConfig = {} as INumInputConfig;
    public statusConfig: IStatusConfig = {} as IStatusConfig;
    public status: IStatus[] = [];

    constructor(
        private orgService: OrganisationService,
    ) {

    }

    public ngOnInit(): void {
        this.setConfigData();
        this.setFormControls();
        this.setForm();
        this.subscribeToData();
        this.setDropDownValues();
        this.setDisplayedColumns();
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe())
    }

    public onSelectionChange(): void {
        this.setDisplayedColumns();
    }

    public onSubmitForm(): void {
        this.subscribeToData();
    }

    private setDisplayedColumns(): void {
        this.displayedColumns = this.columnDropDown.value as string[];
    }

    private setDropDownValues(): void {
        const visibleColumns = this.columnConfig.filter(d => d.visible);
        const visibleColumnIds = visibleColumns.map(d => d.columnId);
        this.columnDropDown.setValue(visibleColumnIds);
    }

    private subscribeToData(): void {
        this.data = null;
        this.data$ = this.orgService.getOrganisations(
            this.form.value.limit,
            this.form.value.offset,
            this.form.value.status
        );
        const sub: Subscription = this.data$.subscribe((d: IOrganisations) => this.data = d);
        this.subscriptions.push(sub);
    }

    private setFormControls(): void {
        const offsetValidators = [
            Validators.min(this.offsetConfig.min),
            Validators.max(this.offsetConfig.max),
        ];
        const limitValidators = [
            Validators.min(this.limitConfig.min),
            Validators.max(this.limitConfig.max),
        ];
        this.offsetInput = new FormControl(this.offsetConfig.default, offsetValidators);
        this.limitInput = new FormControl(this.limitConfig.default, limitValidators);
        this.statusInput = new FormControl(this.statusConfig.default);
    }

    private setForm(): void {
        this.form = new FormGroup({
            'offset': this.offsetInput,
            'limit': this.limitInput,
            'status': this.statusInput,
        });
    }

    private setConfigData(): void {
        this.columnConfig = this.columnConfigData();
        this.offsetConfig = this.offsetConfigData();
        this.limitConfig = this.limitConfigData();
        this.statusConfig = this.statusConfigData();
        this.status = this.statusData();
    }

    private columnConfigData(): IColumnConfig[] {
        return [
            {
                columnId: 'OrgId',
                columnName: 'Organisation ID',
                visible: true,
            },
            {
                columnId: 'Name',
                columnName: 'Organisation Name',
                visible: true,
            },
            {
                columnId: 'PostCode',
                columnName: 'Postcode',
                visible: true,
            },
            {
                columnId: 'Status',
                columnName: 'Status',
                visible: true,
            },
            {
                columnId: 'OrgLink',
                columnName: 'Organisation Link',
                visible: false,
            },
            {
                columnId: 'OrgRecordClass',
                columnName: 'Organisation Record Class',
                visible: false,
            },
            {
                columnId: 'PrimaryRoleDescription',
                columnName: 'Primary Role Description',
                visible: false,
            },
            {
                columnId: 'PrimaryRoleId',
                columnName: 'Primary Role ID',
                visible: false,
            },
            {
                columnId: 'LastChangeDate',
                columnName: 'Last Change Date',
                visible: false,
            },
        ];
    }

    private offsetConfigData(): INumInputConfig {
        return {
            min: 0,
            max: 1000000,
            default: 0,
        };
    }

    private limitConfigData(): INumInputConfig {
        return {
            min: 1,
            max: 1000,
            default: 10,
        };
    }

    private statusConfigData(): IStatusConfig {
        return {
            default: 'active',
        };
    }

    private statusData(): IStatus[] {
        return [
            { id: 'active', displayName: 'Active' },
            { id: 'inactive', displayName: 'Inactive' },
        ];
    }
}
