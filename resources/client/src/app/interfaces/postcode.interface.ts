import { IMatSelectOptions } from "./shared.interface";

export interface IPostcodeAttributesResponse {
    admin_county: IMatSelectOptions[];
    admin_district: IMatSelectOptions[];
    parliamentary_constituency: IMatSelectOptions[];
    police_force_area: IMatSelectOptions[];
    nuts: IMatSelectOptions[];
    postcode_area: IMatSelectOptions[];
    european_electoral_region: IMatSelectOptions[];
    health_authority: IMatSelectOptions[];
    primary_care_trust: IMatSelectOptions[];
    region: IMatSelectOptions[];
    country: IMatSelectOptions[];
};
