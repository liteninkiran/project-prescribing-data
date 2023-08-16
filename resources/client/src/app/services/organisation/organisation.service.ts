import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrganisations } from 'src/app/interfaces/organisation.interfaces';

@Injectable({
    providedIn: 'root'
})
export class OrganisationService {

    constructor(private http: HttpClient) { }

    public getOrganisations(): Observable<IOrganisations> {
        const url = 'https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?Status=Active&Limit=1000';
        return this.http.get<IOrganisations>(`${url}`);
    }
}
