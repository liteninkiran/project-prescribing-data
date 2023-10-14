import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { IRole } from 'src/app/interfaces/role.interface';
import { IMatSelectOptions, IPagedList } from 'src/app/interfaces/shared.interface';

@Injectable({
    providedIn: 'root'
})
export class OrganisationStore {
    private subject = new BehaviorSubject<IRole[]>([]);

    public roles$ : Observable<IRole[]> = this.subject.asObservable();

    private baseUrl = '/api/roles';

    constructor(private http: HttpClient) {
        this.getRolesList();
    }

    public getRoles(): Observable<IPagedList> {
        const url: string = this.baseUrl;
        return this.http.get<IPagedList>(url);
    }

    private getRolesList(): void {
        const url = `${this.baseUrl}/rolesList`;
        const loadData$ = this.http
            .get<IRole[]>(url)
            .pipe(
                map((roles: IRole[]) => roles.map((role: IRole) => ({ ...role, primary_role: !!role.primary_role }))),
                catchError(err => throwError(() => err)),
                tap(roles => this.subject.next(roles))
            );
        loadData$.subscribe();
    }

    public getRolesListByType(primary: boolean, exclude: number[] | null = null): Observable<IMatSelectOptions[]> {
        return this.roles$.pipe(map(roles => roles
                .filter(role => role.primary_role === (primary === true))
                .filter(role => !exclude?.includes(role.id))
                .map(role => ({ id: role.id, name: role.display_name, code: role._id, icon: role.icon }))
        ));
    }
}
