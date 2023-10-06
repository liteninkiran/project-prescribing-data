import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/modules/material.module';
import { NgModule } from '@angular/core';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { PipeModule } from 'src/app/modules/pipe.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { OrganisationComponent } from './organisation/container/organisation.component';
import { OrganisationFiltersComponent } from './organisation/filters/filters.component';
import { OrganisationViewComponent } from './organisation-view/organisation-view.component';
import { OrgViewComponent } from './org-view/org-view.component';
import { OrganisationMapComponent } from './organisation-map/organisation-mapcomponent';

@NgModule({
    declarations: [
        OrganisationComponent,
        OrganisationMapComponent,
        OrganisationFiltersComponent,
        OrganisationViewComponent,
        OrgViewComponent,
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
