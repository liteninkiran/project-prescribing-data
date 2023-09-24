import { FormControl } from "@angular/forms";

export interface IRole {
    id: number;
    _id: string;
    code: string;
    display_name: string;
    primary_role: boolean;
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
    display_name: string;
};
