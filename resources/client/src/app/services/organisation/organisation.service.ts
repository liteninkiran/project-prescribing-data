import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IOrganisationFilters } from 'src/app/interfaces/organisation.interface';
import { IPagedList } from 'src/app/interfaces/shared.interface';

@Injectable()
export class OrganisationService {

    public pager!: IPagedList;

    constructor(private http: HttpClient) {}

    public loadData(filters: IOrganisationFilters, sortCol = 'name', sortOrder = 'asc', pageNumber = 0, pageSize = 10): Observable<any[]> {
        // Create required parameters
        let params = new HttpParams()
            .set('sortCol', sortCol)
            .set('sortOrder', sortOrder)
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        // Add filter parameters
        if (filters.name) { params = params.append('name', filters.name); }

        // TODO... change to multiple parameters of the same name, i.e. primary_roles=10&primary_roles=54&primary_roles=154
        if (filters.primaryRoles) { params = params.append('primary_roles', filters.primaryRoles.join(',')); }
        if (filters.nonPrimaryRoles) { params = params.append('nonPrimary_roles', filters.nonPrimaryRoles.join(',')); }

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
}
