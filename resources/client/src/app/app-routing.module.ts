import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganisationComponent } from './components/organisation/organisation.component';
import { HomeComponent } from './components/home/home.component';
import { OrganisationViewComponent } from './components/organisation-view/organisation-view.component';
import { SamplesComponent } from './components/samples/samples/samples.component';
import { TableSortComponent } from './components/samples/table-sort/table-sort.component';
import { TableSortPaginateFilterComponent } from './components/samples/table-sort-paginate-filter/table-sort-paginate-filter.component';
import { D3MapComponent } from './components/samples/d3-map/d3-map.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'organisations',
        component: OrganisationComponent,
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
        path: '**',
        redirectTo: '/',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
