import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { OrganisationMapComponent } from './components/organisation/organisation-map/organisation-map.component';
import { SamplesComponent } from './components/samples/samples/samples.component';
import { TableAsyncComponent } from './components/samples/table-async/table-async.component';
import { TableSortComponent } from './components/samples/table-sort/table-sort.component';
import { TableSortPaginateFilterComponent } from './components/samples/table-sort-paginate-filter/table-sort-paginate-filter.component';
import { D3MapComponent } from './components/samples/d3/d3-map/d3-map.component';
import { LeafletMapComponent } from './components/samples/leaflet-map/leaflet-map.component';
import { DialogComponent } from './components/samples/dialog/dialog.component';
import { OrganisationComponent } from './components/organisation/organisation/organisation.component';
import { RoleComponent } from './components/role/role/container/role.component';
import { OrganisationViewComponent } from './components/organisation/organisation-view/organisation-view.component';
import { D3Component } from './components/samples/d3/d3.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'roles',
        component: RoleComponent,
    },
    {
        path: 'organisations',
        component: OrganisationComponent,
    },
    {
        path: 'map',
        component: OrganisationMapComponent,
    },
    {
        path: 'organisations/:id',
        component: OrganisationViewComponent,
    },
    {
        path: 'samples',
        component: SamplesComponent,
    },
    {
        path: 'samples/async-table',
        component: TableAsyncComponent,
    },
    {
        path: 'samples/table-sort',
        component: TableSortComponent,
    },
    {
        path: 'samples/table-sort-paginate-filter',
        component: TableSortPaginateFilterComponent,
    },
    {
        path: 'samples/d3',
        component: D3Component,
    },
    {
        path: 'samples/d3-map',
        component: D3MapComponent,
    },
    {
        path: 'samples/leaflet-map',
        component: LeafletMapComponent,
    },
    {
        path: 'samples/dialog',
        component: DialogComponent,
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule { }
