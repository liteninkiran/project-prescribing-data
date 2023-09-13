import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { HomeComponent } from './components/home/home.component';
import { OrganisationComponent } from './components/organisation/organisation.component';
import { OrganisationViewComponent } from './components/organisation-view/organisation-view.component';
import { ArrayConcatPipe } from './pipes/array-concat.pipe';
import { ArrayConcatContactPipe } from './pipes/array-concat-contact.pipe';
import { SamplesComponent } from './components/samples/samples/samples.component';
import { TableSortComponent } from './components/samples/table-sort/table-sort.component';
import { TableSortPaginateFilterComponent } from './components/samples/table-sort-paginate-filter/table-sort-paginate-filter.component';
import { D3MapComponent } from './components/samples/d3-map/d3-map.component';
import { MapComponent } from './components/map/map.component';
import { Map2Component } from './components/map-2/map-2.component';
import { LeafletMapComponent } from './components/samples/leaflet-map/leaflet-map.component';
import { RoleComponent } from './components/role/role.component';
import { GetValuePipe } from './pipes/get-value.pipe';
import { Role2Component } from './components/role2/role2.component';
import { TableComponent } from './components/shared/table/table.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';

@NgModule({
    declarations: [
        // Components
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
        Role2Component,
        TableComponent,

        // Pipes
        ArrayConcatPipe,
        ArrayConcatContactPipe,
        GetValuePipe,
        DateAgoPipe,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatTabsModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatTooltipModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        MatDialogModule,
        MatSelectModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSliderModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatGridListModule,
        MatTreeModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatDividerModule,
        MatSnackBarModule,
        NgxJsonViewerModule,
        LeafletModule,
    ],
    providers: [],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule { }
