import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './d3-map/map/map.component';
import { D3MapComponent } from './d3-map/d3-map.component';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { Map2Component } from './leaflet-map/map-2/map-2.component';
import { DialogComponent } from './dialog/dialog.component';
import { Dialog1Component } from './dialog/example-1/dialog-1.component';
import { DialogOverviewComponent } from './dialog/example-1/dialog-overview/dialog-overview.component';
import { Dialog2Component } from './dialog/example-2/dialog-2.component';
import { DialogContentComponent } from './dialog/example-2/dialog-content/dialog-content.component';
import { Dialog3Component } from './dialog/example-3/dialog-3.component';
import { DialogDataComponent } from './dialog/example-3/dialog-data/dialog-data.component';
import { Dialog4Component } from './dialog/example-4/dialog-4.component';
import { DialogMenu2Component } from './dialog/example-4/dialog-menu-2/dialog-menu-2.component';
import { DialogMenuComponent } from './dialog/example-4/dialog-menu/dialog-menu.component';
import { Dialog5Component } from './dialog/example-5/dialog-5.component';
import { DialogFormComponent } from './dialog/example-5/dialog-form/dialog-form.component';
import { MatMenuChkComponent } from './dialog/mat-menu-chk/mat-menu-chk.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/modules/material.module';
import { TableSortPaginateFilterComponent } from './table-sort-paginate-filter/table-sort-paginate-filter.component';
import { TableSortComponent } from './table-sort/table-sort.component';
import { AsyncFiltersComponent } from './table-async/filters/filters.component';
import { TableAsyncComponent } from './table-async/table-async.component';
import { SharedModule } from '../shared/shared.module';
import { SamplesComponent } from './samples/samples.component';

@NgModule({
    declarations: [
        SamplesComponent,
        D3MapComponent,
        MapComponent,
        LeafletMapComponent,
        Map2Component,
        Dialog1Component,
        DialogOverviewComponent,
        Dialog2Component,
        DialogContentComponent,
        Dialog3Component,
        DialogDataComponent,
        Dialog4Component,
        DialogMenuComponent,
        DialogMenu2Component,
        Dialog5Component,
        DialogFormComponent,
        DialogComponent,
        MatMenuChkComponent,
        TableSortPaginateFilterComponent,
        TableSortComponent,
        TableAsyncComponent,
        AsyncFiltersComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        SharedModule,
    ],
    exports: [
        SamplesComponent,
        D3MapComponent,
        MapComponent,
        LeafletMapComponent,
        Map2Component,
        Dialog1Component,
        DialogOverviewComponent,
        Dialog2Component,
        DialogContentComponent,
        Dialog3Component,
        DialogDataComponent,
        Dialog4Component,
        DialogMenuComponent,
        DialogMenu2Component,
        Dialog5Component,
        DialogFormComponent,
        DialogComponent,
        MatMenuChkComponent,
        TableSortPaginateFilterComponent,
        TableSortComponent,
        TableAsyncComponent,
        AsyncFiltersComponent,
    ],
})
export class SamplesModule { }
