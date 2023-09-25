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
    internalId: string;
    name: string;
    postcode: string;
    primaryRoles: number[] | null;
    nonPrimaryRoles: number[] | null;
};

export interface IOrganisationFilterFormGroup {
    internalId: FormControl<string | null>;
    name: FormControl<string | null>;
    postcode: FormControl<string | null>;
    primaryRoles: FormControl<number[] | null>;
    nonPrimaryRoles: FormControl<number[] | null>;
};
