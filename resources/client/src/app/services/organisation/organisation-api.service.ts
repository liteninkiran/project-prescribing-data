import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrganisations, IRoles, ISingleOrgResponse } from 'src/app/interfaces/organisation-api.interface';

const apiUrl: string = '/nhs_api';

@Injectable({
    providedIn: 'root'
})
export class OrganisationApiService {

    constructor(private http: HttpClient) { }

    public getOrganisation(orgId: string): Observable<ISingleOrgResponse> {
        const url: string = `${apiUrl}/organisations/${orgId}`;
        return this.http.get<ISingleOrgResponse>(url);
    }
}
