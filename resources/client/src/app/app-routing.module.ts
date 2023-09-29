import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { OrganisationViewComponent } from './components/organisation/organisation-view/organisation-view.component';
import { SamplesComponent } from './components/samples/samples/samples.component';
import { TableAsyncComponent } from './components/samples/table-async/table-async.component';
import { TableSortComponent } from './components/samples/table-sort/table-sort.component';
import { TableSortPaginateFilterComponent } from './components/samples/table-sort-paginate-filter/table-sort-paginate-filter.component';
import { D3MapComponent } from './components/samples/d3-map/d3-map.component';
import { LeafletMapComponent } from './components/samples/leaflet-map/leaflet-map.component';
import { DialogComponent } from './components/samples/dialog/dialog.component';
import { OrganisationComponent } from './components/organisation/organisation/container/organisation.component';
import { RoleComponent } from './components/role/role/container/role.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'organisations',
        component: OrganisationComponent,
    },
    {
        path: 'roles',
        component: RoleComponent,
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
