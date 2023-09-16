// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MaterialModule } from './modules/material.module';
import { PipeModule } from './modules/pipe.module';
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { OrganisationComponent } from './components/organisation/organisation.component';
import { OrganisationViewComponent } from './components/organisation-view/organisation-view.component';
import { SamplesComponent } from './components/samples/samples/samples.component';
import { TableSortComponent } from './components/samples/table-sort/table-sort.component';
import { TableSortPaginateFilterComponent } from './components/samples/table-sort-paginate-filter/table-sort-paginate-filter.component';
import { D3MapComponent } from './components/samples/d3-map/d3-map.component';
import { MapComponent } from './components/map/map.component';
import { Map2Component } from './components/map-2/map-2.component';
import { LeafletMapComponent } from './components/samples/leaflet-map/leaflet-map.component';
import { RoleComponent } from './components/role/role.component';
import { TableComponent } from './components/shared/table/table.component';
import { TableAsyncComponent } from './components/samples/table-async/table-async.component';
import { FiltersComponent } from './components/role/filters/filters.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        OrganisationComponent,
        OrganisationViewComponent,
        SamplesComponent,
        TableSortComponent,
        TableSortPaginateFilterComponent,
        D3MapComponent,
        MapComponent,
        Map2Component,
        LeafletMapComponent,
        RoleComponent,
        TableComponent,
        TableAsyncComponent,
        FiltersComponent,
    ],
    imports: [
        // Built-in Modules
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,

        // Custom Modules
        AppRoutingModule,
        MaterialModule,
        PipeModule,
        NgxJsonViewerModule,
        LeafletModule,
    ],
    providers: [],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule { }
