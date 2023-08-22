import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
    IColumnConfig,
    ILastChangeDateConfig,
    INumInputConfig,
    IOrganisation,
    IOrganisations,
    IRole,
    IRoleConfig,
    IRoleData,
    IRoleInput,
    IRoles,
    IStatus,
    IStatusConfig,
    IValidControl,
} from 'src/app/interfaces/organisation.interfaces';
import { MatSelectChange } from '@angular/material/select';

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
    public postcodes$: Observable<any> = new Observable();
    public postcodes: any | null = null;
    public subscriptions: Subscription[] = [];
    public userLocation!: GeolocationPosition;
    public urlObj: {
        url: string;
        baseUrl : string;
    } = {
        url: '',
        baseUrl: '',
    };

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
    public postcodeInput: FormControl = new FormControl();
    public lastChangeDateInput: FormControl = new FormControl();
    public orgNameInput: FormControl = new FormControl();
    // public formGroup = this.fb.group({
    //     'OrgId': true,
    //     'Name': true,
    //     'PostCode': true,
    //     'Status': true,
    //     'OrgLink': false,
    //     'OrgRecordClass': false,
    //     'PrimaryRoleDescription': false,
    //     'PrimaryRoleId': false,
    //     'LastChangeDate': false,
    // });

    // Configuration
    public displayedColumns: string[] = [];
    public columnConfig: IColumnConfig[] = [];
    public offsetConfig: INumInputConfig = {} as INumInputConfig;
    public limitConfig: INumInputConfig = {} as INumInputConfig;
    public statusConfig: IStatusConfig = {} as IStatusConfig;
    public roleConfig: IRoleConfig = {} as IRoleConfig;
    public lastChangeDateConfig: ILastChangeDateConfig = {} as ILastChangeDateConfig;
    public getUserLocation = async (): Promise<GeolocationPosition> => {
        return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition(res, rej);
        });
    };
    public displayedColumnList: string = '';

    constructor(
        private orgService: OrganisationService,
        private _snackBar: MatSnackBar,
        private router: Router,
        private fb: FormBuilder,
    ) {

    }

    public ngOnInit(): void {
        //this.setLocation();
        this.setConfigData();
        this.setForm();
        this.setData();
        this.setDisplayedColumns();
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe())
    }

    public onSelectionChange(event: MatSelectChange): void {
        this.displayedColumnList = event.source.triggerValue;
        this.setDisplayedColumns();
    }

    public onSubmitForm(): void {
        this.subscribeToData();
    }

    public onRowClick(row: IOrganisation): void {
        window.open(`/#/organisations/${row.OrgId}`, "_blank");
    }

    public onPostcodeDoubleClick(): void {
        this.setLocation(false);
    }

    public onPostcodeInput(): void {
        this.postcodeInput.setValue(this.postcodeInput.value.toUpperCase());
    }

    public onLastChangeDateDoubleClick(): void {
        this.lastChangeDateInput.setValue(this.lastChangeDateConfig.min);
    }

    // public toggleColumn(): void {
    //     this.setDisplayedColumns();
    // }

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
            this.urlObj,
            this.form.value.limit,
            this.form.value.offset,
            this.form.value.status,
            this.form.value.primaryRoles.concat(this.form.value.nonPrimaryRoles),
            this.form.value.postcode,
            this.formatDate(this.form.value.lastChangeDate),
            this.form.value.orgName,
        );
        const sub: Subscription = this.data$.subscribe(
            (res: IOrganisations) => {
                let i = 1;
                this.data = res;
                this.data.Organisations.map((o: IOrganisation) => {
                    o.RowNum = i++;
                    o.LastChangeDt = new Date(o.LastChangeDate);
                    o.LastChangeDate = o.LastChangeDt.toLocaleDateString('en-GB');
                });
            },
            (err: any) => {
                this.data = { Organisations: [] };
                this._snackBar.open(err.error.errorText, 'Close');
            }
        );
        this.subscriptions.push(sub);
    }

    private setRolesData(): void {
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
        this.postcodeInput = new FormControl(null);
        this.lastChangeDateInput = new FormControl(null);
        this.orgNameInput = new FormControl(null);
    }

    private setFormGroup(): void {
        const requireOneControl = () => {
            return (formGroup: any) => {
                const err = { atLeastOneRequired: 'At least one filter must be applied' };
                const validControls: IValidControl[] = [
                    { name: 'status', hasValue: formGroup.get('status').value !== null },
                    { name: 'postcode', hasValue: formGroup.get('postcode').value !== null && formGroup.get('postcode').value !== '' },
                    { name: 'orgName', hasValue: formGroup.get('orgName').value !== null && formGroup.get('orgName').value !== '' },
                    { name: 'primaryRoles', hasValue: formGroup.get('primaryRoles').value.length > 0 },
                    { name: 'lastChangeDate', hasValue: formGroup.get('lastChangeDate').value !== null },
                    { name: 'nonPrimaryRoles', hasValue: formGroup.get('nonPrimaryRoles').value.length > 0 },
                ];
                const valid = validControls.filter((ctl: IValidControl) => ctl.hasValue).length > 0;
                return valid ? null : err;
            }
        }

        this.form = new FormGroup({
            'offset': this.offsetInput,
            'limit': this.limitInput,
            'status': this.statusInput,
            'primaryRoles': this.roleInput.primaryRole,
            'nonPrimaryRoles': this.roleInput.nonPrimaryRole,
            'postcode': this.postcodeInput,
            'lastChangeDate': this.lastChangeDateInput,
            'orgName': this.orgNameInput,
        }, requireOneControl());
    }

    private setConfigData(): void {
        this.columnConfig = this.columnConfigData();
        this.offsetConfig = this.numInputConfigData('offset');
        this.limitConfig = this.numInputConfigData('limit');
        this.statusConfig = this.statusConfigData();
        this.roleConfig = this.roleConfigData();
        this.lastChangeDateConfig = this.lastChangeDateConfigData();
    }

    private columnConfigData(): IColumnConfig[] {
        const config: IColumnConfig[] = [
            { columnId: 'RowNum', columnName: 'Row', visible: true },
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

        this.displayedColumnList = config
            .filter(config => config.visible)
            .map(config => config.columnName)
            .join(', ');

        return config;
    }

    private numInputConfigData(type: string): INumInputConfig {
        switch (type) {
            case 'offset': return { min: 0, max: 1000000, default: 0 };
            case 'limit': return { min: 1, max: 1000, default: 100 };
            default: return { min: 0, max: 0, default: 0 };
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
                'RO177',    // PRESCRIBING COST CENTRE
                // 'RO227',    // SCOTTISH GP PRACTICE
            ],
            nonPrimaryDefault: [
                // 'RO76',     // GP PRACTICE
            ],
        };
    }

    private lastChangeDateConfigData(): ILastChangeDateConfig {
        const maxDate: Date = new Date();
        const minDate: Date = new Date();
        minDate.setDate(minDate.getDate() - 185);
        return {
            min: minDate,
            max: maxDate,
        };
    }

    private statusData(): IStatus[] {
        return [
            { id: 'active', displayName: 'Active' },
            { id: 'inactive', displayName: 'Inactive' },
        ];
    }

    private async setLocation(subscribe: boolean = true): Promise<void> {
        if (!this.userLocation) {
            this.userLocation = await this.getUserLocation();
        }
        this.setPostcodes(subscribe);
    }

    private setPostcodes(subscribe: boolean): void {
        this.postcodes$ = this.orgService.getPostcode(
            this.userLocation.coords.latitude,
            this.userLocation.coords.longitude,
        );
        const sub: Subscription = this.postcodes$.subscribe((res) => {
            this.postcodes = res.result;
            this.postcodeInput.setValue(this.postcodes[0].outcode);
            if (subscribe) {
                this.subscribeToData();
            }
        });
        this.subscriptions.push(sub);
    }

    private formatDate(date: Date): string | null {
        if (date) {
            const mn = '0' + (date.getMonth() + 1).toString();
            const dy = '0' + date.getDate().toString();
            const yr = date.getFullYear().toString();
            const dateParts = [
                yr,
                mn.substring(mn.length - 2),
                dy.substring(dy.length - 2),
            ];

            return dateParts.join('-');
        } else {
            return null;
        }
    }
}
