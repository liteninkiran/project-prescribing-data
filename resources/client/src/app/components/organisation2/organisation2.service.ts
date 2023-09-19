import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IPagedList } from 'src/app/interfaces/organisation2.interfaces';

@Injectable()
export class OrganisationService {

    public pager!: IPagedList;

    constructor(private http: HttpClient) {}

    public loadData(filters: any, sortCol = 'name', sortOrder = 'asc', pageNumber = 0, pageSize = 10): Observable<any[]> {
        // Create required parameters
        let params = new HttpParams()
            .set('sortCol', sortCol)
            .set('sortOrder', sortOrder)
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        // Add filter parameters
        if (filters.name) { params = params.append('name', filters.name); }

        const url = '/api/organisations';
        const options = { params: params }
        const callBack = (organisation: any) => ({
            ...organisation,
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
