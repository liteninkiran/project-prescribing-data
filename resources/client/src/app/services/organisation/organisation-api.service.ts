import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const apiUrl: string = 'https://opendata.nhsbsa.net/api/3/action/datastore_search_sql?resource_id=EPD_202406&sql=SELECT * from `EPD_202406` limit 5';

@Injectable({
    providedIn: 'root'
})
export class OrganisationApiService {

    constructor(private http: HttpClient) { }

    public getPrescribingData(orgId: string): Observable<any> {
        console.log(orgId);
        const url: string = `${apiUrl}`;
        return this.http.get<any>(url);
    }
}


/*


https://opendata.nhsbsa.net/dataset/english-prescribing-data-epd

https://opendata.nhsbsa.net/api/3/action/datastore_search
https://opendata.nhsbsa.net/api/3/action/datastore_search_sql
https://opendata.nhsbsa.net/api/3/action/package_list
https://opendata.nhsbsa.net/api/3/action/package_show?id=dataset_name_or_id

https://opendata.nhsbsa.net/api/3/action/datastore_search?resource_id=EPD_202406&limit=5
https://opendata.nhsbsa.net/api/3/action/datastore_search?q=%7B%22TOTAL_QUANTITY%22%3A%2240%3A%2A%22%7D&resource_id=EPD_202406
https://opendata.nhsbsa.net/api/3/action/datastore_search_sql?resource_id=EPD_202406&sql=SELECT * from `EPD_202406` limit 5

var data = {
    resource_id: 'EPD_202406', // the resource id
    limit: 5, // get 5 results
    q: '{"TOTAL_QUANTITY":"40:*"}' // query for 'TOTAL_QUANTITY contains 40'
};
$.ajax({
    url: 'https://opendata.nhsbsa.net/api/3/action/datastore_search',
    data: data,
    dataType: 'jsonp',
    success: function(data) {
        alert('Total results found: ' + data.result.total)
    }
});

*/

