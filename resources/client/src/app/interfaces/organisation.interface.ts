import { FormControl } from "@angular/forms";
import { IPrimaryRole } from "./role.interface";

export interface IOrganisation {
    id: number;
    last_change_date: Date;
    name: string;
    org_id: string;
    org_link: string;
    org_record_class: string;
    post_code: string;
    primary_role_id: number;
    primary_role: IPrimaryRole;
    status: string;
    created_at: Date;
    updated_at: Date;
};

export interface IOrganisationFilters {
    name: string;
    primarRoles: number[];
    nonPrimarRoles: number[];
};

export interface IOrganisationFilterFormGroup {
    name: FormControl<any>;
    primaryRoles: FormControl<any>;
    nonPrimaryRoles: FormControl<any>;
};
