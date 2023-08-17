import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrganisations } from 'src/app/interfaces/organisation.interfaces';

@Injectable({
    providedIn: 'root'
})
export class OrganisationService {

    constructor(private http: HttpClient) { }

    public getOrganisations(status = 'Active', limit = 10, offset = 1): Observable<IOrganisations> {
        const url = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?Status=${status}&Limit=${limit}&Offset=${offset}`;
        return this.http.get<IOrganisations>(`${url}`);
    }
}
