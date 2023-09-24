import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IRole, IRoleFilters } from 'src/app/interfaces/role.interface';
import { IPagedList } from 'src/app/interfaces/shared.interface';

@Injectable()
export class RoleService {

    public pager!: IPagedList;

    constructor(private http: HttpClient) {}

    public loadData(filters: IRoleFilters, sortCol = 'display_name', sortOrder = 'asc', pageNumber = 0, pageSize = 10): Observable<IRole[]> {
        // Create required parameters
        let params = new HttpParams()
            .set('sortCol', sortCol)
            .set('sortOrder', sortOrder)
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        // Add filter parameters
        if (filters.primaryRole) { params = params.append('primary_role', filters.primaryRole); }
        if (filters.roleName) { params = params.append('display_name', filters.roleName); }
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

    public loadDataFromApi(): Observable<any> {
        const url = '/api/roles/store_from_api';
        return this.http.post(url, {});
    }
}
