import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRole } from 'src/app/interfaces/organisation2.interfaces';

@Injectable({
    providedIn: 'root'
})
export class Organisation2Service {

    constructor(private http: HttpClient) { }

    public getRoles(): Observable<IRole[]> {
        const url: string = '/api/roles';
        return this.http.get<IRole[]>(url);
    }
}
