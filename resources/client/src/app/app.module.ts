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
import { Dialog1Component } from './components/samples/dialog/example-1/dialog-1.component';
import { DialogOverviewComponent } from './components/samples/dialog/example-1/dialog-overview/dialog-overview.component';
import { Dialog2Component } from './components/samples/dialog/example-2/dialog-2.component';
import { DialogContentComponent } from './components/samples/dialog/example-2/dialog-content/dialog-content.component';
import { DialogComponent } from './components/samples/dialog/dialog.component';
import { Dialog3Component } from './components/samples/dialog/example-3/dialog-3.component';
import { DialogDataComponent } from './components/samples/dialog/example-3/dialog-data/dialog-data.component';
import { Dialog4Component } from './components/samples/dialog/example-4/dialog-4.component';
import { DialogMenuComponent } from './components/samples/dialog/example-4/dialog-menu/dialog-menu.component';
import { DialogMenu2Component } from './components/samples/dialog/example-4/dialog-menu-2/dialog-menu-2.component';
import { MatMenuChkComponent } from './components/samples/dialog/mat-menu-chk/mat-menu-chk.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        OrganisationComponent,
        OrganisationViewComponent,
        RoleComponent,
        TableComponent,
        FiltersComponent,

        // Sample Components
        SamplesComponent,
        TableAsyncComponent,
        TableSortComponent,
        TableSortPaginateFilterComponent,
        D3MapComponent,
        MapComponent,
        Map2Component,
        LeafletMapComponent,
        Dialog1Component,
        DialogOverviewComponent,
        Dialog2Component,
        DialogContentComponent,
        Dialog3Component,
        DialogDataComponent,
        Dialog4Component,
        DialogMenuComponent,
        DialogMenu2Component,
        DialogComponent,
        MatMenuChkComponent,
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
