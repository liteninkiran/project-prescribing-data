import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IOrganisationFilters } from 'src/app/interfaces/organisation.interface';
import { IPagedList } from 'src/app/interfaces/shared.interface';
import * as moment from 'moment';

@Injectable()
export class OrganisationService {

    public pager!: IPagedList;

    constructor(private http: HttpClient) {}

    public loadData(filters: IOrganisationFilters, sortCol = 'name', sortOrder = 'asc', pageNumber = 0, pageSize = 10): Observable<any[]> {
        // Create required parameters
        let params: HttpParams = this.getParams(sortCol, sortOrder, pageNumber, pageSize);

        // Add filter parameters
        params = this.addFilters(filters, params);

        const url = '/api/organisations';
        const options = { params: params }
        const callBack = (organisation: any) => ({
            ...organisation,
            primary_role_description: organisation.primary_role.display_name,
            created_at: new Date(organisation.created_at),
            updated_at: new Date(organisation.updated_at),
        });

        return this.http.get<IPagedList>(url, options).pipe(
            map((res: IPagedList) => {
                this.pager = res;
                return res.data.map(callBack);
            })
        );
    }

    private getParams(sortCol: string, sortOrder: string, pageNumber: number, pageSize: number): HttpParams {
        return new HttpParams()
            .set('sortCol', sortCol)
            .set('sortOrder', sortOrder)
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());
    }

    private addFilters(filters: IOrganisationFilters, params: HttpParams): HttpParams {
        if (filters.internalId) { params = params.append('org_id', filters.internalId); }
        if (filters.name) { params = params.append('name', filters.name); }
        if (filters.postcode) { params = params.append('postcode', filters.postcode); }
        if (filters.primaryRoles) { filters.primaryRoles.map((role) => params = params.append('primary_roles[]', role.toString())); }
        if (filters.nonPrimaryRoles) { filters.nonPrimaryRoles.map((role) => params = params.append('non_primary_roles[]', role.toString())); }
        if (filters.lastChangeDate) { params = params.append('last_change_date', moment(filters.lastChangeDate).format('YYYY-MM-DD')); }
        return params;
    }
}
