import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) { }

    public getGeoData(): Observable<any> {
        const url = 'assets/STP_April_2020_FEB_in_England_2022.geojson';
        return this.getJson(url);
    }

    private getJson(url: string): Observable<any> {
        return this.http.get<any>(url).pipe(
            retry(3),
        );
    }
}
