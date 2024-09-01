import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) { }

    public getCovidData(): Observable<any> {
        const url = 'assets/daily.json';
        return this.getJson(url);
    }

    private getJson(url: string): Observable<any> {
        return this.http.get<any>(url).pipe(
            retry(3),
        );
    }
}
