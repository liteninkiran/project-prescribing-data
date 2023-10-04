import { FormControl } from '@angular/forms';

export interface IRole {
    id: number;
    _id: string;
    code: string;
    display_name: string;
    primary_role: boolean;
    org_last_updated: Date | null;
    organisations_count: number | null;
    icon: string | null;
    created_at: Date;
    updated_at: Date;
};

export interface IRoleFilters {
    primaryRole: string;
    roleName: string;
    _id: string;
};

export interface IRoleFilterFormGroup {
    primaryRole: FormControl<any>;
    roleName: FormControl<any>;
    _id: FormControl<any>;
};

export interface IPrimaryRole {
    id: number;
    _id: string;
    display_name: string;
    icon: string;
};
