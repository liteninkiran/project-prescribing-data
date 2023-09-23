import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { IRole } from 'src/app/interfaces/organisation2.interfaces';
import { IPagedList } from 'src/app/interfaces/organisation2.interfaces';

@Injectable({
    providedIn: 'root'
})
export class OrganisationStore {
    private subject = new BehaviorSubject<IRole[]>([]);

    roles$ : Observable<IRole[]> = this.subject.asObservable();

    constructor(private http: HttpClient) {
        this.getRolesList();
    }

    public getRoles(): Observable<IPagedList> {
        const url: string = '/api/roles';
        return this.http.get<IPagedList>(url);
    }

    private getRolesList(): void {
        const url = '/api/roles/rolesList';
        const loadCourses$ = this.http
            .get<IRole[]>(url)
            .pipe(
                map((roles: IRole[]) => roles.map((role: IRole) => ({ ...role, primary_role: !!role.primary_role }))),
                catchError(err => throwError(() => err)),
                tap(roles => this.subject.next(roles))
            );
        loadCourses$.subscribe();
    }

    public getRolesListByType(primary: boolean): Observable<IRole[]> {
        return this.roles$.pipe(map(roles => roles.filter(role => role.primary_role === (primary === true))));
    }
}
