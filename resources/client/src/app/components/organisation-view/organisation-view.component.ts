import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ISingleOrg, ISingleOrgResponse, ISingleOrgStatusCount } from 'src/app/interfaces/organisation.interfaces';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { LocationService } from 'src/app/services/location/location.service';
import { icon } from 'leaflet';
import * as L from 'leaflet';

export interface ICoords {
    centre: L.LatLngExpression,
    marker: L.LatLngExpression,
}

@Component({
    selector: 'app-organisation-view',
    templateUrl: './organisation-view.component.html',
    styleUrls: ['./organisation-view.component.scss'],
})
export class OrganisationViewComponent implements OnInit, OnDestroy {

    public id: string = '';
    public organisation: ISingleOrg = {} as ISingleOrg;
    public postcodeData: any | null = null;
    public roleCount: ISingleOrgStatusCount = {} as ISingleOrgStatusCount;
    public relCount: ISingleOrgStatusCount = {} as ISingleOrgStatusCount;

    // Map
    private map!: L.Map;
    private tiles!: L.TileLayer;
    private urlTemplate: string = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    private tileLayerOptions: L.TileLayerOptions = {
        maxZoom: 20,
        attribution: '...',
    };
    private zoom = 12;
    private coords: ICoords = {} as any;
    private marker!: L.Marker;

    // RxJS
    private organisation$: Observable<ISingleOrgResponse> = new Observable();
    private postcodeData$: Observable<any> = new Observable();
    private subscriptions: Subscription[] = [];

    constructor(
        private route: ActivatedRoute,
        private orgService: OrganisationService,
        private locationService: LocationService,
    ) {

    }

    public ngOnInit(): void {
        this.fixLeafletBug();
        this.setId();
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe())
    }

    private setLastChangeDate() {
        this.organisation.LastChangeDt = new Date(this.organisation.LastChangeDate);
        this.organisation.LastChangeDate = this.organisation.LastChangeDt.toLocaleDateString('en-GB');
    }

    private setRoleCount() {
        this.roleCount.Active = this.organisation.Roles.Role.filter(x => x.Status === 'Active').length;
        this.roleCount.Inactive = this.organisation.Roles.Role.filter(x => x.Status === 'Inactive').length;
        this.roleCount.total = this.roleCount.Active + this.roleCount.Inactive;
        this.roleCount.view = this.roleCount[this.organisation.Status as keyof ISingleOrgStatusCount];
    }

    private setRelCount() {
        this.relCount.Active = this.organisation.Rels ? this.organisation.Rels.Rel.filter(x => x.Status === 'Active').length : 0;
        this.relCount.Inactive = this.organisation.Rels ? this.organisation.Rels.Rel.filter(x => x.Status === 'Inactive').length : 0;
        this.relCount.total = this.relCount.Active + this.relCount.Inactive;
        this.relCount.view = this.relCount[this.organisation.Status as keyof ISingleOrgStatusCount];
    }

    private setId() {
        this.route.paramMap.subscribe(params => {
            this.id = params.get('id') as string;
            this.setOrganisation();
        });
    }

    private setOrganisation() {
        this.organisation$ = this.orgService.getOrganisation(this.id);
        const sub: Subscription = this.organisation$.subscribe((res: ISingleOrgResponse) => {
            this.organisation = res.Organisation;
            console.log(this.organisation.Name);
            this.setLastChangeDate();
            this.setRoleCount();
            this.setRelCount();
            this.getPostcodeData();
        });
        this.subscriptions.push(sub);
    }

    private setMap() {
        if (!this.map) {
            this.map = L.map('map', { zoomSnap: 0.1, zoomControl: false });
        }
        this.map.setView(this.coords.centre, this.zoom);
        this.tiles = L.tileLayer(this.urlTemplate, this.tileLayerOptions).addTo(this.map);
        if (this.marker) {
            this.map.removeLayer(this.marker);
        }
        this.marker = L.marker(this.coords.marker).addTo(this.map);
    }

    private getPostcodeData(): void {
        this.postcodeData$ = this.locationService.getPostcodeData(this.organisation.GeoLoc.Location.PostCode);
        const sub: Subscription = this.postcodeData$.subscribe((res) => {
            this.postcodeData = res.result;
            this.coords.centre = [this.postcodeData.latitude, this.postcodeData.longitude];
            this.coords.marker = [this.postcodeData.latitude, this.postcodeData.longitude];
            this.setMap();
        });
        this.subscriptions.push(sub);
    }

    private fixLeafletBug() {
        const iconRetinaUrl = 'assets/marker-icon-2x.png';
        const iconUrl = 'assets/marker-icon.png';
        const shadowUrl = 'assets/marker-shadow.png';
        const iconDefault = icon({
            iconRetinaUrl,
            iconUrl,
            shadowUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41],
        });
        L.Marker.prototype.options.icon = iconDefault;
    }
}
