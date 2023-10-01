import { FormControl } from '@angular/forms';
import { IPrimaryRole } from './role.interface';

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
    postcode?: IOrgPostcode;
    status: string;
    created_at: Date;
    updated_at: Date;
};

export interface IOrgPostcode {
    id: number;
    latitude: number;
    longitude: number;
}

export interface IOrganisationFilters {
    organisationId: string | null;
    name: string | null;
    postcode: string | null;
    primaryRoles: number[] | null;
    nonPrimaryRoles: number[] | null;
    lastChangeDate: Date | null;
    status: string | null;
    adminCounty: number[] | null;
    adminDistrict: number[] | null;
};

export interface IOrganisationFilterFormGroup {
    organisationId: FormControl<string | null>;
    name: FormControl<string | null>;
    status: FormControl<string | null>;
    primaryRoles: FormControl<number[] | null>;
    nonPrimaryRoles: FormControl<number[] | null>;
    lastChangeDate: FormControl<Date | null>;
    postcode: FormControl<string | null>;
    adminCounty: FormControl<number[] | null>;
    adminDistrict: FormControl<number[] | null>;
};

export interface IOrganisationStatus {
    id: string;
    displayName: string;
};

export interface IOrganisationMapResponse {
    data: IOrganisation[];
    total: number;
    limit: number;
    limit_exceeded: boolean;
}
