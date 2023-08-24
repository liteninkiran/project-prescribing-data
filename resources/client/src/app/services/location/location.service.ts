import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    constructor(private http: HttpClient) { }

    public getPostcode(lat: number, long: number): Observable<any> {
        const url: string = `https://api.postcodes.io/postcodes?lon=${long}&lat=${lat}`;
        return this.http.get<any>(`${url}`);
    }

    public getPostcodeData(postcode: string): Observable<any> {
        const url: string = `https://api.postcodes.io/postcodes/${postcode}`;
        return this.http.get<any>(`${url}`);
    }
}
