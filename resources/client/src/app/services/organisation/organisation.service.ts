import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IOrganisation, IOrganisationFilters, IOrganisationMapResponse } from 'src/app/interfaces/organisation.interface';
import { IPagedList } from 'src/app/interfaces/shared.interface';
import * as moment from 'moment';

@Injectable()
export class OrganisationService {

    public pager!: IPagedList;

    constructor(private http: HttpClient) {}

    public loadData(filters: IOrganisationFilters, sortCol = 'name', sortOrder = 'asc', pageNumber = 0, pageSize = 10): Observable<IOrganisation[]> {
        // Create required parameters
        let params: HttpParams = this.getParams(sortCol, sortOrder, pageNumber, pageSize);

        // Add filter parameters
        params = this.addFilters(filters, params);

        const url = '/api/organisations';
        const options = { params: params }
        const callBack = (organisation: IOrganisation) => ({
            ...organisation,
            last_change_date: new Date(organisation.last_change_date),
            created_at: new Date(organisation.created_at),
            updated_at: new Date(organisation.updated_at),
        });

        return this.http.get<IPagedList>(url, options).pipe(
            map((res: IPagedList) => {
                this.pager = res;
                const orgs: IOrganisation[] = res.data;
                return orgs.map(callBack);
            })
        );
    }

    public loadMapData(filters: IOrganisationFilters, sortCol = 'name', sortOrder = 'asc', pageNumber = 0, pageSize = 10): Observable<IOrganisationMapResponse> {
        // Create required parameters
        let params: HttpParams = this.getParams(sortCol, sortOrder, pageNumber, pageSize);

        // Add filter parameters
        params = this.addFilters(filters, params);

        const url = '/api/organisations/map';
        const options = { params: params }
        const callBack = (organisation: IOrganisation) => ({
            ...organisation,
            created_at: new Date(organisation.created_at),
            updated_at: new Date(organisation.updated_at),
        });

        return this.http.get<IOrganisationMapResponse>(url, options).pipe(
            map((res: IOrganisationMapResponse) => {
                return { ...res, data: res.data.map(callBack) };
            })
        );
    }

    public loadOrganisationData(id: string, filters: IOrganisationFilters): Observable<IOrganisation[]> {
        let params: HttpParams = new HttpParams();
        params = this.addFilters(filters, params);
        const url = '/api/organisations/view/' + id;
        const options = { params: params }
        const callBack = (organisation: IOrganisation) => ({
            ...organisation,
            last_change_date: new Date(organisation.last_change_date),
            created_at: new Date(organisation.created_at),
            updated_at: new Date(organisation.updated_at),
        });
        return this.http.get<IOrganisation[]>(url, options).pipe(
            map((res: IOrganisation[]) => {
                return res.map(callBack);
            })
        );
    }

    public loadDataFromApi(roleId: string): Observable<any> {
        const url = `/api/organisations/store_from_api/${roleId}`;
        return this.http.post(url, {});
    }

    private getParams(sortCol: string, sortOrder: string, pageNumber: number, pageSize: number): HttpParams {
        return new HttpParams()
            .set('sortCol', sortCol)
            .set('sortOrder', sortOrder)
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());
    }

    private addFilters(filters: IOrganisationFilters, params: HttpParams): HttpParams {
        if (filters.organisationId) { params = params.append('org_id', filters.organisationId); }
        if (filters.name) { params = params.append('name', filters.name); }
        if (filters.status !== null) { params = params.append('status', filters.status); }
        if (filters.primaryRoles) { filters.primaryRoles.map((role) => params = params.append('primary_roles[]', role.toString())); }
        if (filters.nonPrimaryRoles) { filters.nonPrimaryRoles.map((role) => params = params.append('non_primary_roles[]', role.toString())); }
        if (filters.lastChangeDate) { params = params.append('last_change_date', moment(filters.lastChangeDate).format('YYYY-MM-DD')); }
        if (filters.postcode) { params = params.append('postcode', filters.postcode); }
        if (filters.adminCounty) { filters.adminCounty.map((item) => params = params.append('admin_county[]', item.toString())); }
        if (filters.adminDistrict) { filters.adminDistrict.map((item) => params = params.append('admin_district[]', item.toString())); }
        if (filters.parliamentaryConstituency) { filters.parliamentaryConstituency.map((item) => params = params.append('parliamentary_constituency[]', item.toString())); }
        if (filters.policeForceArea) { filters.policeForceArea.map((item) => params = params.append('pfa[]', item.toString())); }
        if (filters.nuts) { filters.nuts.map((item) => params = params.append('nuts[]', item.toString())); }
        if (filters.postcodeArea) { filters.postcodeArea.map((item) => params = params.append('postcode_area[]', item.toString())); }
        if (filters.europeanElectoralRegion) { filters.europeanElectoralRegion.map((item) => params = params.append('european_electoral_region[]', item.toString())); }
        if (filters.healthAuthority) { filters.healthAuthority.map((item) => params = params.append('health_authority[]', item.toString())); }
        if (filters.primaryCareTrust) { filters.primaryCareTrust.map((item) => params = params.append('primary_care_trust[]', item.toString())); }
        if (filters.region) { filters.region.map((item) => params = params.append('region[]', item.toString())); }
        if (filters.country) { filters.country.map((item) => params = params.append('country[]', item.toString())); }
        return params;
    }
}
