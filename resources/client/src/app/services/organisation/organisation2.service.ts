import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagedList } from 'src/app/interfaces/organisation2.interfaces';

@Injectable({
    providedIn: 'root'
})
export class Organisation2Service {

    constructor(private http: HttpClient) { }

    public getRoles(): Observable<IPagedList> {
        const url: string = '/api/roles';
        return this.http.get<IPagedList>(url);
    }
}
