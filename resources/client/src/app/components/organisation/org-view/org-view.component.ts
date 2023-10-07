import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { IOrganisation } from 'src/app/interfaces/organisation.interface';
import { IRole } from 'src/app/interfaces/role.interface';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { OrganisationStore } from 'src/app/services/organisation/organisation.store';

@Component({
    selector: 'app-org-view',
    templateUrl: './org-view.component.html',
    styleUrls: ['./org-view.component.scss'],
    providers: [OrganisationService, OrganisationStore],
})
export class OrgViewComponent implements OnInit, OnDestroy {
    public id: string = '';
    public organisation$: Observable<IOrganisation> = new Observable<IOrganisation>();
    public organisation: IOrganisation = {} as IOrganisation;
    public mapData: IOrganisation[] = [];
    public form!: FormGroup;
    public initialZoom: number = 14;
    public zoomSettings = {
        min: 6,
        max: 20,
        initial: 6,
    }
    public zoomInput: FormControl<number | null> = new FormControl(this.initialZoom);
    public primaryRolesInput: FormControl<number[] | null> = new FormControl([]);
    public zoom: number | null = null;
    public mapOptions: L.MapOptions = {
        scrollWheelZoom: false,
        doubleClickZoom: false,
        dragging: false,
    }
    public primaryRoles$!: Observable<IRole[]>;

    private subscriptions: Subscription[] = [];

    constructor(
        private route: ActivatedRoute,
        readonly orgService: OrganisationService,
        private orgStore: OrganisationStore,
    ) {

    }

    public ngOnInit(): void {
        this.primaryRoles$ = this.orgStore.getRolesListByType(true);
        this.setId();
        this.setForm();
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe())
    }

    public dragEnd(event: any): void {
        console.log(this.zoomInput.value);
    }

    private loadData(): void {
        this.organisation$ = this.orgService.loadOrganisation(this.id);
        const sub: Subscription = this.organisation$.subscribe((res: IOrganisation) => {
            this.organisation = res;
            this.mapData = [];
            this.mapData.push(res);
        });
        this.subscriptions.push(sub);
    }

    private setId() {
        this.route.paramMap.subscribe(params => {
            this.id = params.get('id') as string;
            this.loadData();
        });
    }

    private setForm() {
        this.form = new FormGroup({
            zoom: this.zoomInput,
            primaryRoles: this.primaryRolesInput,
        });

        this.primaryRolesInput.valueChanges.subscribe(console.log);
    }
}
