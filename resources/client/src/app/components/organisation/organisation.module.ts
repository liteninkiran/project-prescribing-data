import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/modules/material.module';
import { NgModule } from '@angular/core';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { PipeModule } from 'src/app/modules/pipe.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { OrganisationComponent } from './organisation/organisation.component';
import { OrganisationFiltersComponent } from './organisation-filters/organisation-filters.component';
import { OrganisationViewComponent } from './organisation-view/organisation-view.component';
import { OrganisationMapComponent } from './organisation-map/organisation-map.component';
import { OrganisationMap2Component } from './organisation-map2/organisation-map2.component';

@NgModule({
    declarations: [
        OrganisationComponent,
        OrganisationMapComponent,
        OrganisationFiltersComponent,
        OrganisationViewComponent,
        OrganisationMap2Component,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        NgxJsonViewerModule,
        PipeModule,
        ReactiveFormsModule,
        SharedModule,
    ],
})
export class OrganisationModule { }
