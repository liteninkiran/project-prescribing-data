export interface IOrganisations {
    Organisations: IOrganisation[];
};

export interface IOrganisation {
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

export interface IColumnConfig {
    columnId: string;
    columnName: string;
    visible: boolean;
};
