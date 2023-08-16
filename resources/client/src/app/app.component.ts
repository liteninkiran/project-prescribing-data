import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IOrganisations } from './interfaces/organisation.interfaces';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

    public data$: Observable<IOrganisations> = new Observable();

    private url = 'https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PrimaryRoleId=RO177';
    // private subscriptions: Subscription[] = [];

    constructor(private http: HttpClient) {

    }

    public ngOnInit(): void {
        this.data$ = this.getData();
    }

    public ngOnDestroy(): void {
        //this.subscriptions.map((sub: Subscription) => sub.unsubscribe())
    }

    public getDataClick(): void {
        // this.data$ = this.getData();
        // const sub: Subscription = this.data$.subscribe(console.log);
        // this.subscriptions.push(sub);
    }

    public getData(): Observable<IOrganisations> {
        return this.http.get<IOrganisations>(`${this.url}`);
    }
}
