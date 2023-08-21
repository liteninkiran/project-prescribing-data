import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganisationComponent } from './components/organisation/organisation.component';
import { HomeComponent } from './components/home/home.component';
import { OrganisationViewComponent } from './components/organisation-view/organisation-view.component';
import { SamplesComponent } from './components/samples/samples/samples.component';
import { TableSortComponent } from './components/samples/table-sort/table-sort.component';

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
        path: '**',
        redirectTo: '/',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
