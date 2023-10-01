export interface IPostcodeAttribute {
    id: number;
    code: string;
    name: string;
};

export interface IPostcodeAttributeNameOnly {
    id: number;
    code: string;
    name: string;
};

export interface IPostcodeAttributesResponse {
    admin_county: IPostcodeAttribute[];
    admin_district: IPostcodeAttribute[];
    parliamentary_constituency: IPostcodeAttribute[];
    police_force_area: IPostcodeAttribute[];
    nuts: IPostcodeAttribute[];
};
