import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { IPostcodeAttributesResponse } from 'src/app/interfaces/postcode.interface';
import { IMatSelectOptions } from 'src/app/interfaces/shared.interface';

@Injectable({
    providedIn: 'root'
})
export class PostcodeStore {
    private subject = new BehaviorSubject<IPostcodeAttributesResponse>({} as IPostcodeAttributesResponse);

    public attributes$ : Observable<IPostcodeAttributesResponse> = this.subject.asObservable();

    private baseUrl = '/api/postcodes';

    constructor(private http: HttpClient) {
        this.getPostcodesList();
    }

    private getPostcodesList(): void {
        const url = `${this.baseUrl}/postcode_attributes`;
        const loadData$ = this.http
            .get<IPostcodeAttributesResponse>(url)
            .pipe(
                catchError(err => throwError(() => err)),
                tap(res => this.subject.next(res))
            );
        loadData$.subscribe();
    }

    public getAdminCounties(): Observable<IMatSelectOptions[]> {
        return this.attributes$.pipe(map(attributes => attributes.admin_county));
    }

    public getAdminDistricts(): Observable<IMatSelectOptions[]> {
        return this.attributes$.pipe(map(attributes => attributes.admin_district));
    }

    public getParliamentaryConstituencies(): Observable<IMatSelectOptions[]> {
        return this.attributes$.pipe(map(attributes => attributes.parliamentary_constituency));
    }

    public getPoliceForceAreas(): Observable<IMatSelectOptions[]> {
        return this.attributes$.pipe(map(attributes => attributes.police_force_area));
    }

    public getNuts(): Observable<IMatSelectOptions[]> {
        return this.attributes$.pipe(map(attributes => attributes.nuts));
    }

    public getPostcodeArea(): Observable<IMatSelectOptions[]> {
        return this.attributes$.pipe(map(attributes => attributes.postcode_area));
    }

    public getEuropeanElectoralRegion(): Observable<IMatSelectOptions[]> {
        return this.attributes$.pipe(map(attributes => attributes.european_electoral_region));
    }

    public getHealthAuthority(): Observable<IMatSelectOptions[]> {
        return this.attributes$.pipe(map(attributes => attributes.health_authority));
    }

    public getPrimaryCareTrust(): Observable<IMatSelectOptions[]> {
        return this.attributes$.pipe(map(attributes => attributes.primary_care_trust));
    }

    public getRegion(): Observable<IMatSelectOptions[]> {
        return this.attributes$.pipe(map(attributes => attributes.region));
    }

    public getCountry(): Observable<IMatSelectOptions[]> {
        return this.attributes$.pipe(map(attributes => attributes.country));
    }
}
