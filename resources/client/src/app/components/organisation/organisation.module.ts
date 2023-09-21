import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/modules/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { OrganisationComponent } from './organisation/organisation.component';
import { OrganisationFiltersComponent } from './organisation/filters/filters.component';
import { SharedModule } from '../shared/shared.module';
import { OrganisationViewComponent } from './organisation-view/organisation-view.component';
import { PipeModule } from 'src/app/modules/pipe.module';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { OrganisationApiComponent } from './organisation-api/organisation.component';

@NgModule({
    declarations: [
        OrganisationComponent,
        OrganisationFiltersComponent,
        OrganisationViewComponent,
        OrganisationApiComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        SharedModule,
        PipeModule,
        NgxJsonViewerModule,
    ],
    exports: [
        OrganisationComponent,
        OrganisationFiltersComponent,
        OrganisationViewComponent,
        OrganisationApiComponent,
    ],
})
export class OrganisationModule { }
