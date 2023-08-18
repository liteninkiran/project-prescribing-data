import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { IColumnConfig, INumInputConfig, IOrganisations, IRole, IRoleConfig, IRoleData, IRoleInput, IRoles, IStatus, IStatusConfig } from 'src/app/interfaces/organisation.interfaces';
import { Observable, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';

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
    public roles$: Observable<IRoles> = new Observable();
    public roles: IRoleData = {
        primaryRoles: null,
        nonPrimaryRoles: null,
    };
    public status: IStatus[] = [];
    public subscriptions: Subscription[] = [];

    // Form
    public form!: FormGroup;
    public visibleColumns: FormControl = new FormControl(['']);          // Must be array because multiple=true
    public offsetInput: FormControl = new FormControl();
    public limitInput: FormControl = new FormControl();
    public statusInput: FormControl = new FormControl();
    public roleInput: IRoleInput = {
        primaryRole: new FormControl(['']),                              // Must be array because multiple=true
        nonPrimaryRole: new FormControl(['']),                           // Must be array because multiple=true
    };

    // Configuration
    public displayedColumns: string[] = [];
    public columnConfig: IColumnConfig[] = [];
    public offsetConfig: INumInputConfig = {} as INumInputConfig;
    public limitConfig: INumInputConfig = {} as INumInputConfig;
    public statusConfig: IStatusConfig = {} as IStatusConfig;
    public roleConfig: IRoleConfig = {} as IRoleConfig;

    constructor(
        private orgService: OrganisationService,
    ) {

    }

    public ngOnInit(): void {
        this.setConfigData();
        this.setForm();
        this.setData();
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

    private setData(): void {
        this.setVisibleColumns();
        this.setStatusData();
        this.setRolesData();
        this.subscribeToData();
    }

    private setDisplayedColumns(): void {
        this.displayedColumns = this.visibleColumns.value as string[];
    }

    private setVisibleColumns(): void {
        const visibleColumns = this.columnConfig.filter(d => d.visible);
        const visibleColumnIds = visibleColumns.map(d => d.columnId);
        this.visibleColumns.setValue(visibleColumnIds);
    }

    private subscribeToData(): void {
        this.data = null;
        this.data$ = this.orgService.getOrganisations(
            this.form.value.limit,
            this.form.value.offset,
            this.form.value.status,
            this.form.value.primaryRoles.concat(this.form.value.nonPrimaryRoles),
        );
        const sub: Subscription = this.data$.subscribe((d: IOrganisations) => this.data = d);
        this.subscriptions.push(sub);
    }

    private setRolesData(): void {
        this.roles.primaryRoles = null;
        this.roles.nonPrimaryRoles = null;
        this.roles$ = this.orgService.getRoles();
        const sub: Subscription = this.roles$.subscribe((d: IRoles) => {
            const transformData = (roles: IRole[], isPrimary: string) => {
                roles = roles.filter((role: IRole) => role.primaryRole === isPrimary);
                roles.sort((a: IRole, b: IRole) => a.displayName > b.displayName ? 1 : -1);
                return roles;
            }
            // Primary Roles
            this.roles.primaryRoles = { ...d };
            this.roles.primaryRoles.Roles = transformData(this.roles.primaryRoles.Roles, 'true');
            // Non-Primary Roles
            this.roles.nonPrimaryRoles = { ...d };
            this.roles.nonPrimaryRoles.Roles = transformData(this.roles.nonPrimaryRoles.Roles, 'false');
        });
        this.subscriptions.push(sub);
    }

    private setStatusData(): void {
        this.status = this.statusData();
    }

    private setForm(): void {
        this.setFormControls();
        this.setFormGroup();
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
        this.roleInput.primaryRole = new FormControl(this.roleConfig.primaryDefault);
        this.roleInput.nonPrimaryRole = new FormControl(this.roleConfig.nonPrimaryDefault);
    }

    private setFormGroup(): void {
        this.form = new FormGroup({
            'offset': this.offsetInput,
            'limit': this.limitInput,
            'status': this.statusInput,
            'primaryRoles': this.roleInput.primaryRole,
            'nonPrimaryRoles': this.roleInput.nonPrimaryRole,
        });
    }

    private setConfigData(): void {
        this.columnConfig = this.columnConfigData();
        this.offsetConfig = this.numInputConfigData('offset');
        this.limitConfig = this.numInputConfigData('limit');
        this.statusConfig = this.statusConfigData();
        this.roleConfig = this.roleConfigData();
    }

    private columnConfigData(): IColumnConfig[] {
            return [
                { columnId: 'OrgId', columnName: 'Organisation ID', visible: true },
                { columnId: 'Name', columnName: 'Organisation Name', visible: true },
                { columnId: 'PostCode', columnName: 'Postcode', visible: true },
                { columnId: 'PrimaryRoleId', columnName: 'Primary Role ID', visible: false },
                { columnId: 'PrimaryRoleDescription', columnName: 'Primary Role', visible: true },
                { columnId: 'OrgLink', columnName: 'Organisation Link', visible: false },
                { columnId: 'OrgRecordClass', columnName: 'Organisation Record Class', visible: false },
                { columnId: 'Status', columnName: 'Status', visible: true },
                { columnId: 'LastChangeDate', columnName: 'Last Change Date', visible: false },
            ];
    }

    private numInputConfigData(type: string): INumInputConfig {
        switch (type) {
            case 'offset': return { min: 0, max: 1000000, default:  0 };
            case 'limit' : return { min: 1, max:    1000, default: 10 };
            default      : return { min: 0, max:       0, default:  0 };
        }
    }

    private statusConfigData(): IStatusConfig {
        return {
            default: 'active',
        };
    }

    private roleConfigData(): IRoleConfig {
        return {
            primaryDefault: [
                // 'RO177',    // PRESCRIBING COST CENTRE
                // 'RO227',    // SCOTTISH GP PRACTICE
            ],
            nonPrimaryDefault: [
                'RO76',     // GP PRACTICE
            ],
        };
    }

    private statusData(): IStatus[] {
        return [
            { id: 'active', displayName: 'Active' },
            { id: 'inactive', displayName: 'Inactive' },
        ];
    }
}
