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
    status: number | null;
    adminCounty: number[] | null;
    adminDistrict: number[] | null;
    parliamentaryConstituency: number[] | null;
    policeForceArea: number[] | null;
    nuts: number[] | null;
    europeanElectoralRegion: number[] | null;
    healthAuthority: number[] | null;
    primaryCareTrust: number[] | null;
    region: number[] | null;
    country: number[] | null;
};

export interface IOrganisationFilterFormGroup {
    organisationId: FormControl<string | null>;
    name: FormControl<string | null>;
    status: FormControl<number | null>;
    primaryRoles: FormControl<number[] | null>;
    nonPrimaryRoles: FormControl<number[] | null>;
    lastChangeDate: FormControl<Date | null>;
    postcode: FormControl<string | null>;
    adminCounty: FormControl<number[] | null>;
    adminDistrict: FormControl<number[] | null>;
    parliamentaryConstituency: FormControl<number[] | null>;
    policeForceArea: FormControl<number[] | null>;
    nuts: FormControl<number[] | null>;
    europeanElectoralRegion: FormControl<number[] | null>;
    healthAuthority: FormControl<number[] | null>;
    primaryCareTrust: FormControl<number[] | null>;
    region: FormControl<number[] | null>;
    country: FormControl<number[] | null>;
};

export interface IOrganisationStatus {
    id: number;
    displayName: string;
};

export interface IOrganisationMapResponse {
    data: IOrganisation[];
    total: number;
    limit: number;
    limit_exceeded: boolean;
}
