import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IPagedList, IRole } from 'src/app/interfaces/organisation2.interfaces';

@Injectable()
export class RoleService {

    public pager!: IPagedList;

    constructor(private http: HttpClient) {}

    public loadData(filter: string, sortCol = 'id', sortOrder = 'asc', pageNumber = 0, pageSize = 3): Observable<IRole[]> {
        const options = {
            params: new HttpParams()
                .set('filter', filter)
                .set('sortCol', sortCol)
                .set('sortOrder', sortOrder)
                .set('pageNumber', pageNumber.toString())
                .set('pageSize', pageSize.toString())
        }
        return this.http.get<IPagedList>('/api/roles', options).pipe(
            map((res: IPagedList) => {
                this.pager = res;
                return res.data.map((role: IRole): IRole => {
                    return {
                        ...role,
                        primary_role: !!role.primary_role,
                        created_at: new Date(role.created_at),
                        updated_at: new Date(role.updated_at),
                    };
                });
            })
        );
    }
}
