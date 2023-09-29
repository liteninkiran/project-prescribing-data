import { Component, OnInit } from '@angular/core';
import { IOrganisationFilters } from 'src/app/interfaces/organisation.interface';
import { OrganisationMapDataSource } from './organisation-map.data-source';
import { OrganisationService } from 'src/app/services/organisation/organisation.service';
import { icon, Marker } from 'leaflet';
import * as turf from '@turf/turf';
import * as L from 'leaflet';

const blackIcon = L.icon({
    iconUrl     : 'assets/map-marker.svg',
    iconSize    : [40, 40], // size of the icon
    iconAnchor  : [20, 40], // point of the icon which will correspond to marker's location
    popupAnchor : [0, -40] // point from which the popup should open relative to the iconAnchor
});

const redIcon = L.icon({
    iconUrl     : 'assets/map-marker-red.svg',
    iconSize    : [40, 40], // size of the icon
    iconAnchor  : [20, 40], // point of the icon which will correspond to marker's location
    popupAnchor : [0, -40] // point from which the popup should open relative to the iconAnchor
});

@Component({
    selector: 'app-organisation-map',
    templateUrl: './organisation-map.component.html',
    styleUrls: ['./organisation-map.component.scss'],
    providers: [OrganisationService],
})
export class OrganisationMapComponent implements OnInit {
    public filters: IOrganisationFilters = {} as IOrganisationFilters;
    public dataSource!: OrganisationMapDataSource;

    // User location
    private getUserLocation = async (): Promise<GeolocationPosition> => {
        return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition(res, rej);
        });
    };
    private userLocation!: GeolocationPosition;

    // Map
    private map!: L.Map;
    private tiles!: L.TileLayer;
    private urlTemplate: string = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    private tileLayerOptions: L.TileLayerOptions = {
        maxZoom: 20,
        attribution: '...',
    };
    private zoom = 12;
    private centre = [50.794257, -1.066010];
    private centreCoords!: L.LatLngExpression;
    private otherCoords!: L.LatLngExpression[];
    private featureGroup!: L.FeatureGroup<any>;

    constructor(
        readonly orgService: OrganisationService,
    ) { }

    public ngOnInit(): void {
        this.dataSource = new OrganisationMapDataSource(this.orgService);
        this.dataSource.loadMapData(this.filters);

        this.setLocation();
        this.setCordinates(this.centre[0], this.centre[1]);
        this.setupMap();
    }

    public updateFilters(filters: any): void {
        this.filters = filters;
    }

    private async setLocation(setMap = false): Promise<void> {
        if (!this.userLocation) {
            this.userLocation = await this.getUserLocation();
            if (setMap) {
                this.setCordinates(this.userLocation.coords.latitude, this.userLocation.coords.longitude);
                this.setupMap();
            }
        }
    }

    private setCordinates(lat: number, long: number) {
        this.centreCoords = [lat, long];
        this.otherCoords = [
            this.centreCoords,
            [lat + 0.005, long + 0.008],
            [51, -1],
        ];
    }

    private setupMap() {
        this.fixLeafletBug();
        this.setMapObjects();
    }

    private setMapObjects() {
        this.map = L.map('map', { zoomSnap: 0.1 }).setView(this.centreCoords, this.zoom);
        this.tiles = L.tileLayer(this.urlTemplate, this.tileLayerOptions).addTo(this.map);

        const markers: L.Marker[] = [];

        this.otherCoords.forEach((coords: L.LatLngExpression) => {
            const marker: L.Marker = L
                .marker(coords, { icon: blackIcon });
                // .on('mousemove', (e: L.LeafletMouseEvent) => {
                //     const m: L.Marker = e.target;
                //     m.setIcon(redIcon);
                // })
                // .on('mouseout', (e: L.LeafletMouseEvent) => {
                //     const m: L.Marker = e.target;
                //     m.setIcon(blackIcon);
                // });
            markers.push(marker);
        });

        this.featureGroup = L
            .featureGroup([...markers])
            .addTo(this.map);
            // .on('mousemove', (e: L.LeafletMouseEvent) => {
            //     const m: L.Marker = e.propagatedFrom;
            //     m.setIcon(redIcon);
            // });

        this.map.fitBounds(this.featureGroup.getBounds(), { padding: [40, 40] });

        const options: {
            units?: turf.Units;
        } = {
            units: 'miles'
        };

        this.map.on('mousemove', (e: L.LeafletMouseEvent) => {
            const from = turf.point([e.latlng.lat, e.latlng.lng]);
            markers.forEach((marker: L.Marker) => {
                const to = turf.point([marker.getLatLng().lat, marker.getLatLng().lng]);
                const distance = turf.distance(from, to, options);
                distance < 3 ? marker.setIcon(redIcon) : marker.setIcon(blackIcon);
            });
        });

        this.map.on('moveend', (e: L.LeafletEvent) => {
            //console.log(this.map.getCenter());
        });
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
        Marker.prototype.options.icon = iconDefault;
    }
}
