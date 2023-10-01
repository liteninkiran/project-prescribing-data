export interface IAdminCounty {
    id: number;
    code: string;
    name: string;
};

export interface IAdminDistrict {
    id: number;
    code: string;
    name: string;
};

export interface IPostcodeAttributesResponse {
    admin_county: IAdminCounty[];
    admin_district: IAdminDistrict[];
};
