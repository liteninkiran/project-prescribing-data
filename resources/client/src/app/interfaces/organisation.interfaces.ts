import { FormControl } from "@angular/forms";

export interface IOrganisations {
    Organisations: IOrganisation[];
};

export interface IOrganisation {
    RowNum?: number;
    LastChangeDt?: Date;
    LastChangeDate: string;
    Name: string;
    OrgId: string;
    OrgLink: string;
    OrgRecordClass: string;
    PostCode: string;
    PrimaryRoleDescription: string;
    PrimaryRoleId: string;
    Status: string;
};

export interface IRoles {
    Roles: IRole[];
};

export interface IRole {
    id: string;
    code: string;
    displayName: string;
    primaryRole: string;
};

export interface IRoleConfig {
    primaryDefault: string[];
    nonPrimaryDefault: string[];
};

export interface IRoleData {
    primaryRoles: IRoles | null,
    nonPrimaryRoles: IRoles | null,
};

export interface IRoleInput {
    primaryRole: FormControl,
    nonPrimaryRole: FormControl,
};

export interface IColumnConfig {
    columnId: string;
    columnName: string;
    visible: boolean;
};

export interface INumInputConfig {
    min: number;
    max: number;
    default: number;
};

export interface IStatusConfig {
    default: string;
};

export interface IStatus {
    id: string;
    displayName: string;
};

export interface ILastChangedDateConfig {
    min: Date;
    max: Date;
};

export interface IValidControl {
    name: string;
    hasValue: boolean;
};
