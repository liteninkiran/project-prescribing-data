import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/modules/material.module';
import { NgModule } from '@angular/core';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { PipeModule } from 'src/app/modules/pipe.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { OrganisationApiComponent } from './organisation-api/organisation-api.component';
import { OrganisationComponent } from './organisation/container/organisation.component';
import { OrganisationFiltersComponent } from './organisation/filters/filters.component';
import { OrganisationViewComponent } from './organisation-view/organisation-view.component';

@NgModule({
    declarations: [
        OrganisationApiComponent,
        OrganisationComponent,
        OrganisationFiltersComponent,
        OrganisationViewComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        NgxJsonViewerModule,
        PipeModule,
        ReactiveFormsModule,
        SharedModule,
    ],
    exports: [
        OrganisationApiComponent,
        OrganisationComponent,
        OrganisationFiltersComponent,
        OrganisationViewComponent,
    ],
})
export class OrganisationModule { }
