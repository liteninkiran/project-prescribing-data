import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrganisations, ISingleOrgResponse } from 'src/app/interfaces/organisation.interfaces';

@Injectable({
    providedIn: 'root'
})
export class OrganisationService {

    constructor(private http: HttpClient) { }

    public getOrganisations(
        urlObj: { url: string; baseUrl: string; },
        limit: number = 10,
        offset: number = 0,
        status: string | null = null,
        roles: string[] | null = null,
        postcode: string | null = null,
        lastChangeDate: string | null = null,
        name: string | null = null,
    ): Observable<IOrganisations> {

        const baseUrl: string = 'https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations';
        let url: string = `${baseUrl}?`;
        const rolesStr = roles?.join('%2C');
        const postcodeStr = postcode?.replace(' ', '%20');
        const nameStr = name?.replace(' ', '%20');

        url += offset > 0     ? `Offset=${offset}&`                 : '';
        url += limit  > 0     ? `Limit=${limit}&`                   : '';
        url += status         ? `Status=${status}&`                 : '';
        url += roles          ? `Roles=${rolesStr}&`                : '';
        url += postcode       ? `PostCode=${postcodeStr}&`          : '';
        url += lastChangeDate ? `LastChangeDate=${lastChangeDate}&` : '';
        url += name           ? `Name=${nameStr}&`                  : '';
        url = url.slice(0, -1);

        urlObj.baseUrl = baseUrl;
        urlObj.url = url;

        return this.http.get<IOrganisations>(`${url}`);
    }

    public getRoles(): Observable<any> {
        const url: string = 'https://directory.spineservices.nhs.uk/ORD/2-0-0/roles';
        return this.http.get<any>(`${url}`);
    }

    public getOrganisation(orgId: string): Observable<ISingleOrgResponse> {
        const url: string = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/${orgId}`;
        return this.http.get<ISingleOrgResponse>(`${url}`);
    }
}


/*
        * ORGANISATIONS *

        Example URL:

        https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations
            ?Name=surgery
            &Roles=RO198%2CRO197            <-- COMMA
            &LastChangeDate=2021-12-01
            &RelTypeId=RE5
            &TargetOrgId=RRF12
            &OrgRecordClass=RC2
            &NonPrimaryRoleId=RO197
            &PrimaryRoleId=RO198
            &PostCode=CW10%209FG            <-- SPACE
            &Status=Active
            &Limit=5
            &Offset=0
            &_format=json


        Note:

        %2C = COMMA
        %20 = SPACE
*/
