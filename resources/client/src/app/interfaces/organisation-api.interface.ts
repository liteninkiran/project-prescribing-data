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
    isPrimaryRole?: boolean;
    RowNum?: number;
};

export interface ISingleOrgResponse {
    Organisation: ISingleOrg;
};

export interface ISingleOrg {
    Contacts?: ISingleOrgContacts;
    Date: ISingleOrgDate[];
    GeoLoc: ISingleOrgGeoLoc;
    LastChangeDate: string;
    LastChangeDt: Date;
    Name: string;
    OrgId: ISingleOrgOrgId;
    Rels: ISingleOrgRels;
    Roles: ISingleOrgRoles;
    Status: string;
    orgRecordClass: string;
};

export interface ISingleOrgRoles {
    Role: ISingleOrgRole[];
};

export interface ISingleOrgRole {
    id: string;
    uniqueRoleId: number;
    Status: string;
    primaryRole?: boolean;
    Date: ISingleOrgDate[];
};

export interface ISingleOrgDate {
    start: string;
    end?: string;
    type: string;
};

export interface ISingleOrgOrgId {
    assigningAuthorityName: string;
    extension: string;
    root: string;
};

export interface ISingleOrgGeoLoc {
    Location: ISingleOrgGeoLocLocation;
};

export interface ISingleOrgGeoLocLocation {
    AddrLn1: string;
    AddrLn2: string;
    Country: string;
    County: string;
    PostCode: string;
    Town: string;
    UPRN?: number;
};

export interface ISingleOrgContacts {
    Contact: ISingleOrgContact[];
};

export interface ISingleOrgContact {
    type: string;
    value: string;
};

export interface ISingleOrgRels {
    Rel: ISingleOrgRel[];
};

export interface ISingleOrgRel {
    Date: ISingleOrgDate[];
    Status: string;
    Target: ISingleOrgTarget;
    id: string;
    uniqueRelId: number;
};

export interface ISingleOrgTarget {
    OrgId: ISingleOrgOrgId
    PrimaryRoleId: ISingleOrgPrimaryRole;
};

export interface ISingleOrgPrimaryRole {
    id: string;
    uniqueRoleId: number;
};

export interface ISingleOrgStatusCount {
    Active: number;
    Inactive: number;
    total: number;
    view: number;
};