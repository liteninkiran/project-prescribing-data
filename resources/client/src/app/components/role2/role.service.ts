import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IPagedList, IRole, IRoleFilters } from 'src/app/interfaces/organisation2.interfaces';

@Injectable()
export class RoleService {

    public pager!: IPagedList;

    constructor(private http: HttpClient) {}

    public loadData(filters: IRoleFilters, sortCol = 'id', sortOrder = 'asc', pageNumber = 0, pageSize = 3): Observable<IRole[]> {
        // Create required parameters
        let params = new HttpParams()
            .set('sortCol', sortCol)
            .set('sortOrder', sortOrder)
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        // Add filter parameters
        if (filters.primaryRole) { params = params.append('primaryRole', filters.primaryRole); }
        if (filters.roleName) { params = params.append('roleName', filters.roleName); }
        if (filters._id) { params = params.append('_id', filters._id); }

        const url = '/api/roles';
        const options = { params: params }
        const callBack = (role: IRole) => ({
            ...role,
            primary_role: !!role.primary_role,
            created_at: new Date(role.created_at),
            updated_at: new Date(role.updated_at),
        });

        return this.http.get<IPagedList>(url, options).pipe(
            map((res: IPagedList) => {
                this.pager = res;
                return res.data.map(callBack);
            })
        );
    }
}
